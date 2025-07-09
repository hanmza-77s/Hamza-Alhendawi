from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.engagement_service import EngagementService
from pydantic import BaseModel

router = APIRouter(prefix="/engagement", tags=["engagement"])
engagement_service = EngagementService()

class AutoReplyRequest(BaseModel):
    account_id: int
    reply_strategy: str = "positive_only"  # "positive_only", "positive_neutral", "all"

class BulkEngagementRequest(BaseModel):
    account_id: int
    action: str = "like_recent"  # "like_recent", "follow_users"

@router.post("/monitor-comments/{account_id}")
async def monitor_comments(
    account_id: int,
    db: Session = Depends(get_db)
):
    """Monitor and collect new comments"""
    result = await engagement_service.monitor_comments(db, account_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/auto-reply")
async def auto_reply_comments(
    request: AutoReplyRequest,
    db: Session = Depends(get_db)
):
    """Automatically reply to comments"""
    result = await engagement_service.auto_reply_comments(
        db=db,
        account_id=request.account_id,
        reply_strategy=request.reply_strategy
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/comments/{account_id}")
async def get_recent_comments(
    account_id: int,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get recent comments for account"""
    comments = engagement_service.get_recent_comments(db, account_id, limit)
    return {"comments": comments}

@router.get("/analytics/{account_id}")
async def get_comment_analytics(
    account_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get comment analytics"""
    analytics = engagement_service.get_comment_analytics(db, account_id, days)
    return analytics

@router.post("/bulk-action")
async def bulk_engagement_action(
    request: BulkEngagementRequest,
    db: Session = Depends(get_db)
):
    """Perform bulk engagement actions"""
    result = await engagement_service.bulk_engagement_action(
        db=db,
        account_id=request.account_id,
        action=request.action
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result