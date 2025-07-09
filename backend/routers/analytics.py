from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from backend.database import get_db
from backend import models

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/{account_id}")
async def get_analytics(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter_by(id=account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    contents = db.query(models.Content).filter_by(account_id=account_id).all()
    total = len(contents)
    posted = sum(1 for c in contents if c.posted)
    scheduled = total - posted

    # Aggregate per day for chart
    chart = {}
    for c in contents:
        if not c.scheduled_time:
            continue
        day = c.scheduled_time.date().isoformat()
        if day not in chart:
            chart[day] = {"posted": 0, "scheduled": 0}
        chart[day]["posted" if c.posted else "scheduled"] += 1

    dates = sorted(chart.keys())
    posted_counts = [chart[d]["posted"] for d in dates]
    sched_counts = [chart[d]["scheduled"] for d in dates]

    return {
        "total": total,
        "posted": posted,
        "scheduled": scheduled,
        "dates": dates,
        "posted_counts": posted_counts,
        "scheduled_counts": sched_counts,
    }