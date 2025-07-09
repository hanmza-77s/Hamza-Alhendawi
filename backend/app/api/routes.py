from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from backend.app.core.database import get_db
from backend.app.services.ai_service import AIService
from backend.app.services.content_service import ContentService
from backend.app.services.scheduler_service import SchedulerService
from backend.app.services.automation_service import AutomationService
from backend.app.models.user import User
from backend.app.models.account import SocialAccount
from backend.app.models.content import Content, ContentSchedule
from backend.app.models.analytics import Analytics
from pydantic import BaseModel
from datetime import datetime

api_router = APIRouter()

# Pydantic models for request/response
class AccountCreate(BaseModel):
    platform: str
    username: str
    password: str
    theme: str

class ContentGenerateRequest(BaseModel):
    theme: str
    content_type: str = "image"
    count: int = 1

class ScheduleRequest(BaseModel):
    account_id: int
    content_batch: List[Dict]

class EngagementRequest(BaseModel):
    account_id: int
    action_type: str = "like"
    count: int = 1

# Initialize services
ai_service = AIService()
content_service = ContentService()
scheduler_service = SchedulerService()
automation_service = AutomationService()

# Account Management Routes
@api_router.post("/accounts/create")
async def create_account(account_data: AccountCreate, db: Session = Depends(get_db)):
    """Create a new social media account."""
    try:
        # Simulate login to verify credentials
        login_result = await automation_service.simulate_login(
            account_data.username, 
            account_data.password, 
            account_data.platform
        )
        
        if not login_result["success"]:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Create account record
        account = SocialAccount(
            platform=account_data.platform,
            username=account_data.username,
            password=account_data.password,  # In production, encrypt this
            theme=account_data.theme,
            is_active=True,
            auto_posting=True
        )
        
        db.add(account)
        db.commit()
        db.refresh(account)
        
        return {
            "success": True,
            "account_id": account.id,
            "message": f"Account created successfully for {account_data.platform}",
            "login_result": login_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/accounts")
async def get_accounts(db: Session = Depends(get_db)):
    """Get all social media accounts."""
    try:
        accounts = db.query(SocialAccount).all()
        return {
            "accounts": [
                {
                    "id": account.id,
                    "platform": account.platform,
                    "username": account.username,
                    "theme": account.theme,
                    "is_active": account.is_active,
                    "auto_posting": account.auto_posting,
                    "created_at": account.created_at.isoformat()
                }
                for account in accounts
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Content Generation Routes
@api_router.post("/content/generate")
async def generate_content(request: ContentGenerateRequest):
    """Generate AI content for the specified theme."""
    try:
        if request.count == 1:
            content = await content_service.generate_complete_content(
                request.theme, 
                request.content_type
            )
            return {"content": content}
        else:
            content_batch = await content_service.create_content_batch(
                request.theme, 
                request.count
            )
            return {"content_batch": content_batch}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/content/generate-strategy")
async def generate_content_strategy(theme: str):
    """Generate a complete content strategy for a theme."""
    try:
        strategy = await ai_service.generate_content_strategy(theme)
        return {"strategy": strategy}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Scheduling Routes
@api_router.post("/scheduler/schedule")
async def schedule_content(request: ScheduleRequest, db: Session = Depends(get_db)):
    """Schedule content for posting."""
    try:
        schedules = await scheduler_service.schedule_content_batch(
            request.content_batch,
            request.account_id,
            db
        )
        return {"schedules": schedules}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/scheduler/posts/{account_id}")
async def get_scheduled_posts(account_id: int, db: Session = Depends(get_db)):
    """Get all scheduled posts for an account."""
    try:
        posts = await scheduler_service.get_scheduled_posts(account_id, db)
        return {"scheduled_posts": posts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/scheduler/cancel/{schedule_id}")
async def cancel_scheduled_post(schedule_id: int, db: Session = Depends(get_db)):
    """Cancel a scheduled post."""
    try:
        success = await scheduler_service.cancel_scheduled_post(schedule_id, db)
        if success:
            return {"message": "Post cancelled successfully"}
        else:
            raise HTTPException(status_code=404, detail="Schedule not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Automation Routes
@api_router.post("/automation/engage")
async def perform_engagement(request: EngagementRequest):
    """Perform engagement actions (likes, comments, follows)."""
    try:
        results = []
        for _ in range(request.count):
            result = await automation_service.simulate_engagement(request.action_type)
            results.append(result)
        
        return {
            "action_type": request.action_type,
            "count": request.count,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/automation/stories")
async def view_stories():
    """Simulate viewing stories."""
    try:
        result = await automation_service.simulate_story_viewing()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/automation/stats")
async def get_automation_stats():
    """Get automation statistics."""
    try:
        stats = await automation_service.get_automation_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analytics Routes
@api_router.get("/analytics/{account_id}")
async def get_analytics(account_id: int, db: Session = Depends(get_db)):
    """Get analytics for an account."""
    try:
        # Get account
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")
        
        # Get content for this account
        contents = db.query(Content).filter(Content.account_id == account_id).all()
        
        # Calculate analytics
        total_posts = len(contents)
        total_likes = sum(content.engagement_metrics.get("likes", 0) for content in contents if content.engagement_metrics)
        total_comments = sum(content.engagement_metrics.get("comments", 0) for content in contents if content.engagement_metrics)
        total_shares = sum(content.engagement_metrics.get("shares", 0) for content in contents if content.engagement_metrics)
        
        # Calculate engagement rate
        total_engagement = total_likes + total_comments + total_shares
        engagement_rate = (total_engagement / (total_posts * 100)) * 100 if total_posts > 0 else 0
        
        analytics = {
            "account_id": account_id,
            "platform": account.platform,
            "theme": account.theme,
            "total_posts": total_posts,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_shares": total_shares,
            "engagement_rate": round(engagement_rate, 2),
            "last_updated": datetime.now().isoformat()
        }
        
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Service Routes
@api_router.post("/ai/generate-caption")
async def generate_caption(theme: str, content_type: str = "image"):
    """Generate a caption for the given theme."""
    try:
        caption = await ai_service.generate_caption(theme, content_type)
        return {"caption": caption}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/generate-hashtags")
async def generate_hashtags(theme: str, count: int = 15):
    """Generate hashtags for the given theme."""
    try:
        hashtags = await ai_service.generate_hashtags(theme, count)
        return {"hashtags": hashtags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ai/generate-image")
async def generate_image(theme: str, content_type: str = "post"):
    """Generate an image for the given theme."""
    try:
        prompt = await ai_service.generate_image_prompt(theme, content_type)
        image_path = await ai_service.generate_image(prompt)
        return {"image_path": image_path, "prompt": prompt}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health Check
@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}