from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.content_service import ContentService
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/content", tags=["content"])
content_service = ContentService()

class GenerateContentRequest(BaseModel):
    account_id: int
    content_type: str = "image"  # "image", "video", "carousel"

class CustomContentRequest(BaseModel):
    account_id: int
    caption: str
    content_type: str
    custom_prompt: Optional[str] = None

class BatchContentRequest(BaseModel):
    account_id: int
    count: int = 7

@router.post("/generate")
async def generate_content(
    request: GenerateContentRequest,
    db: Session = Depends(get_db)
):
    """Generate AI content post"""
    result = await content_service.generate_content_post(
        db=db,
        account_id=request.account_id,
        content_type=request.content_type
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/generate-batch")
async def generate_batch_content(
    request: BatchContentRequest,
    db: Session = Depends(get_db)
):
    """Generate multiple content posts"""
    result = await content_service.generate_batch_content(
        db=db,
        account_id=request.account_id,
        count=request.count
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/create-custom")
async def create_custom_content(
    request: CustomContentRequest,
    db: Session = Depends(get_db)
):
    """Create custom content with user input"""
    result = await content_service.create_custom_post(
        db=db,
        account_id=request.account_id,
        caption=request.caption,
        content_type=request.content_type,
        custom_prompt=request.custom_prompt
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/posts/{account_id}")
async def get_content_posts(
    account_id: int,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get content posts for account"""
    posts = content_service.get_content_posts(db, account_id, status)
    
    return {
        "posts": [
            {
                "id": post.id,
                "title": post.title,
                "caption": post.caption,
                "hashtags": post.hashtags,
                "content_type": post.content_type,
                "media_urls": post.media_urls,
                "music_url": post.music_url,
                "status": post.status,
                "scheduled_time": post.scheduled_time.isoformat() if post.scheduled_time else None,
                "posted_time": post.posted_time.isoformat() if post.posted_time else None,
                "engagement_stats": post.engagement_stats,
                "created_at": post.created_at.isoformat()
            }
            for post in posts
        ]
    }

@router.get("/post/{post_id}")
async def get_content_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get specific content post"""
    post = content_service.get_content_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {
        "post": {
            "id": post.id,
            "title": post.title,
            "caption": post.caption,
            "hashtags": post.hashtags,
            "content_type": post.content_type,
            "media_urls": post.media_urls,
            "music_url": post.music_url,
            "status": post.status,
            "scheduled_time": post.scheduled_time.isoformat() if post.scheduled_time else None,
            "posted_time": post.posted_time.isoformat() if post.posted_time else None,
            "engagement_stats": post.engagement_stats,
            "created_at": post.created_at.isoformat()
        }
    }

@router.put("/post/{post_id}/status")
async def update_post_status(
    post_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """Update post status"""
    success = content_service.update_post_status(db, post_id, status)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"success": True, "message": f"Post status updated to {status}"}

@router.delete("/post/{post_id}")
async def delete_content_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Delete content post"""
    success = content_service.delete_content_post(db, post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"success": True, "message": "Post deleted successfully"}