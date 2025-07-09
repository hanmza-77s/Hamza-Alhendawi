from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session

from backend.models import Content

POST_INTERVAL_HOURS = 24  # simple interval, enhance later


def schedule_contents(db: Session, contents: List[Content]):
    """Assign future posting times if not yet scheduled."""
    start = datetime.utcnow() + timedelta(minutes=5)
    for idx, item in enumerate(contents):
        if item.scheduled_time is None:
            item.scheduled_time = start + timedelta(hours=POST_INTERVAL_HOURS * idx)
    db.commit()


def due_contents(db: Session) -> List[Content]:
    return (
        db.query(Content)
        .filter(Content.scheduled_time <= datetime.utcnow(), Content.posted.is_(False))
        .all()
    )