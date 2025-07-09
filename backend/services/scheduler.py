from datetime import datetime, timedelta, time as dtime
from typing import List
import random, logging

from sqlalchemy.orm import Session

from backend.models import Content
from backend.services import social

log = logging.getLogger(__name__)

# Preferred posting hours (24h) – could be per account in future
OPTIMAL_HOURS = [9, 12, 15, 18, 21]


def _next_optimal_datetime(after: datetime) -> datetime:
    """Return the next optimal datetime after a given timestamp."""
    day = after.date()
    for _ in range(7):  # look up to a week ahead
        for hour in OPTIMAL_HOURS:
            candidate = datetime.combine(day, dtime(hour, 0))
            if candidate > after:
                # Add random jitter (±10 minutes) to look human
                jitter = timedelta(minutes=random.randint(-10, 10))
                return candidate + jitter
        day += timedelta(days=1)
    return after + timedelta(hours=24)


def schedule_contents(db: Session, contents: List[Content]):
    """Assign future posting times using optimal slots."""
    now = datetime.utcnow()
    for item in contents:
        if item.scheduled_time is None:
            item.scheduled_time = _next_optimal_datetime(now)
            now = item.scheduled_time  # next post after this
    db.commit()


def due_contents(db: Session) -> List[Content]:
    return (
        db.query(Content)
        .filter(Content.scheduled_time <= datetime.utcnow(), Content.posted.is_(False))
        .all()
    )


def run_pending(db: Session):
    """Publish due contents and auto-reply to comments."""
    items = due_contents(db)
    if not items:
        return
    log.info("Found %d contents to publish", len(items))
    for item in items:
        account = item.account  # via relationship lazy load
        success = social.publish(account, item)
        if success:
            item.posted = True
            db.commit()
            # wait a bit then handle comments
            social.auto_reply(account, item)
        else:
            log.warning("Failed to publish content id=%s", item.id)