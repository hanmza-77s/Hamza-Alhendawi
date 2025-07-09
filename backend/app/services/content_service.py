from sqlalchemy.orm import Session
from app.models.models import ContentPost, SocialAccount, ContentStrategy
from app.ai.openai_service import OpenAIService
from app.ai.mock_services import MockVideoService, MockMusicService
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import random

class ContentService:
    def __init__(self):
        self.ai_service = OpenAIService()
        self.video_service = MockVideoService()
        self.music_service = MockMusicService()
    
    async def generate_content_post(self, db: Session, account_id: int, content_type: str = "image") -> Dict:
        """Generate a complete content post with AI"""
        
        # Get account and strategy
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        strategy = db.query(ContentStrategy).filter(ContentStrategy.account_id == account_id).first()
        if not strategy:
            return {"success": False, "error": "No content strategy found"}
        
        try:
            # Choose content pillar
            content_pillars = strategy.content_pillars or [account.theme]
            content_pillar = random.choice(content_pillars)
            
            # Generate caption
            caption = await self.ai_service.generate_post_caption(
                account.theme, 
                content_pillar, 
                account.platform
            )
            
            # Generate hashtags
            hashtags = await self.ai_service.generate_hashtags(
                account.theme, 
                caption, 
                account.platform
            )
            hashtags_str = " ".join(hashtags)
            
            # Generate media based on content type
            media_urls = []
            music_url = None
            
            if content_type in ["image", "carousel"]:
                # Generate image(s)
                image_prompt = await self.ai_service.generate_image_prompt(account.theme, caption)
                image_url = await self.ai_service.generate_image(image_prompt)
                
                if image_url:
                    media_urls.append(image_url)
                    
                    # Generate additional images for carousel
                    if content_type == "carousel":
                        for _ in range(random.randint(1, 3)):
                            additional_image = await self.ai_service.generate_image(image_prompt)
                            if additional_image:
                                media_urls.append(additional_image)
            
            elif content_type == "video":
                # Generate video content
                image_prompt = await self.ai_service.generate_image_prompt(account.theme, caption)
                image_url = await self.ai_service.generate_image(image_prompt)
                
                if image_url:
                    # Generate music
                    music_url = await self.music_service.generate_background_music(account.theme)
                    
                    # Create video from image and music
                    video_url = await self.video_service.generate_video(
                        image_url, 
                        music_url or "", 
                        caption, 
                        account.theme
                    )
                    
                    if video_url:
                        media_urls.append(video_url)
            
            # Create content post record
            content_post = ContentPost(
                account_id=account_id,
                title=f"{account.theme.title()} Content - {content_pillar}",
                caption=caption,
                hashtags=hashtags_str,
                content_type=content_type,
                media_urls=media_urls,
                music_url=music_url,
                scheduled_time=None,  # Will be set when scheduling
                status="draft"
            )
            
            db.add(content_post)
            db.commit()
            db.refresh(content_post)
            
            return {
                "success": True,
                "post_id": content_post.id,
                "content": {
                    "caption": caption,
                    "hashtags": hashtags,
                    "media_urls": media_urls,
                    "music_url": music_url,
                    "content_type": content_type
                },
                "message": "Content generated successfully"
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to generate content: {str(e)}"}
    
    async def generate_batch_content(self, db: Session, account_id: int, count: int = 7) -> Dict:
        """Generate multiple content posts for the week"""
        
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        posts = []
        content_types = ["image", "video", "carousel"]
        
        for i in range(count):
            content_type = random.choice(content_types)
            result = await self.generate_content_post(db, account_id, content_type)
            
            if result["success"]:
                posts.append(result)
        
        return {
            "success": True,
            "posts_generated": len(posts),
            "posts": posts,
            "message": f"Generated {len(posts)} content posts"
        }
    
    def get_content_posts(self, db: Session, account_id: int, status: str = None):
        """Get content posts for an account"""
        query = db.query(ContentPost).filter(ContentPost.account_id == account_id)
        
        if status:
            query = query.filter(ContentPost.status == status)
        
        return query.order_by(ContentPost.created_at.desc()).all()
    
    def get_content_post(self, db: Session, post_id: int) -> Optional[ContentPost]:
        """Get a specific content post"""
        return db.query(ContentPost).filter(ContentPost.id == post_id).first()
    
    def update_post_status(self, db: Session, post_id: int, status: str) -> bool:
        """Update post status"""
        post = self.get_content_post(db, post_id)
        if post:
            post.status = status
            if status == "posted":
                post.posted_time = datetime.utcnow()
            db.commit()
            return True
        return False
    
    def delete_content_post(self, db: Session, post_id: int) -> bool:
        """Delete a content post"""
        post = self.get_content_post(db, post_id)
        if post:
            db.delete(post)
            db.commit()
            return True
        return False
    
    async def create_custom_post(self, db: Session, account_id: int, caption: str, content_type: str, custom_prompt: str = None) -> Dict:
        """Create a custom content post with user input"""
        
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        try:
            # Generate hashtags for the custom caption
            hashtags = await self.ai_service.generate_hashtags(account.theme, caption, account.platform)
            hashtags_str = " ".join(hashtags)
            
            # Generate media
            media_urls = []
            music_url = None
            
            if content_type in ["image", "carousel"]:
                image_prompt = custom_prompt or await self.ai_service.generate_image_prompt(account.theme, caption)
                image_url = await self.ai_service.generate_image(image_prompt)
                
                if image_url:
                    media_urls.append(image_url)
            
            elif content_type == "video":
                image_prompt = custom_prompt or await self.ai_service.generate_image_prompt(account.theme, caption)
                image_url = await self.ai_service.generate_image(image_prompt)
                
                if image_url:
                    music_url = await self.music_service.generate_background_music(account.theme)
                    video_url = await self.video_service.generate_video(image_url, music_url or "", caption, account.theme)
                    
                    if video_url:
                        media_urls.append(video_url)
            
            # Create post
            content_post = ContentPost(
                account_id=account_id,
                title="Custom Content Post",
                caption=caption,
                hashtags=hashtags_str,
                content_type=content_type,
                media_urls=media_urls,
                music_url=music_url,
                status="draft"
            )
            
            db.add(content_post)
            db.commit()
            db.refresh(content_post)
            
            return {
                "success": True,
                "post_id": content_post.id,
                "content": {
                    "caption": caption,
                    "hashtags": hashtags,
                    "media_urls": media_urls,
                    "music_url": music_url,
                    "content_type": content_type
                }
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to create custom post: {str(e)}"}