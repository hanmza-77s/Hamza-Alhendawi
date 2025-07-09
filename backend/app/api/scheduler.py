from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.scheduler_service import SchedulerService
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(prefix="/scheduler", tags=["scheduler"])
scheduler_service = SchedulerService()

class SchedulePostRequest(BaseModel):
    post_id: int
    scheduled_time: datetime

class OptimalScheduleRequest(BaseModel):
    account_id: int
    post_ids: List[int]

@router.post("/schedule-post")
async def schedule_post(
    request: SchedulePostRequest,
    db: Session = Depends(get_db)
):
    """Schedule a single post"""
    result = scheduler_service.schedule_post(
        db=db,
        post_id=request.post_id,
        scheduled_time=request.scheduled_time
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/schedule-optimal")
async def schedule_optimal_times(
    request: OptimalScheduleRequest,
    db: Session = Depends(get_db)
):
    """Schedule posts at optimal times based on AI strategy"""
    result = scheduler_service.schedule_optimal_times(
        db=db,
        account_id=request.account_id,
        post_ids=request.post_ids
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/publish-scheduled")
async def publish_scheduled_posts(
    db: Session = Depends(get_db)
):
    """Manually trigger publishing of scheduled posts"""
    result = await scheduler_service.publish_scheduled_posts(db)
    return result

@router.get("/scheduled/{account_id}")
async def get_scheduled_posts(
    account_id: int,
    db: Session = Depends(get_db)
):
    """Get all scheduled posts for an account"""
    posts = scheduler_service.get_scheduled_posts(db, account_id)
    return {"scheduled_posts": posts}

@router.delete("/cancel/{post_id}")
async def cancel_scheduled_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Cancel a scheduled post"""
    result = scheduler_service.cancel_scheduled_post(db, post_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/analytics/{account_id}")
async def get_posting_analytics(
    account_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get posting analytics for account"""
    analytics = scheduler_service.get_posting_analytics(db, account_id, days)
    return analytics