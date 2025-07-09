from sqlalchemy.orm import Session
from app.models.models import Comment, SocialAccount, ContentPost
from app.ai.openai_service import OpenAIService
from app.ai.mock_services import MockBrowserAutomation
from typing import Dict, List
from datetime import datetime
import asyncio

class EngagementService:
    def __init__(self):
        self.ai_service = OpenAIService()
        self.browser_service = MockBrowserAutomation()
    
    async def monitor_comments(self, db: Session, account_id: int) -> Dict:
        """Monitor and collect new comments from recent posts"""
        
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        # Get recent posts
        recent_posts = db.query(ContentPost).filter(
            ContentPost.account_id == account_id,
            ContentPost.status == "posted"
        ).order_by(ContentPost.posted_time.desc()).limit(10).all()
        
        new_comments = []
        
        for post in recent_posts:
            try:
                # Mock getting comments (in production, this would scrape actual comments)
                post_comments = await self.browser_service.get_comments(f"post_{post.id}")
                
                for comment_data in post_comments:
                    # Check if comment already exists
                    existing_comment = db.query(Comment).filter(
                        Comment.account_id == account_id,
                        Comment.post_id == f"post_{post.id}",
                        Comment.commenter_username == comment_data["username"]
                    ).first()
                    
                    if not existing_comment:
                        # Analyze sentiment
                        sentiment = await self.ai_service.analyze_sentiment(comment_data["text"])
                        
                        # Create comment record
                        comment = Comment(
                            account_id=account_id,
                            post_id=f"post_{post.id}",
                            commenter_username=comment_data["username"],
                            comment_text=comment_data["text"],
                            sentiment=sentiment
                        )
                        
                        db.add(comment)
                        new_comments.append({
                            "post_id": post.id,
                            "username": comment_data["username"],
                            "text": comment_data["text"],
                            "sentiment": sentiment
                        })
                
            except Exception as e:
                print(f"Error monitoring comments for post {post.id}: {e}")
                continue
        
        db.commit()
        
        return {
            "success": True,
            "new_comments": len(new_comments),
            "comments": new_comments,
            "message": f"Found {len(new_comments)} new comments"
        }
    
    async def auto_reply_comments(self, db: Session, account_id: int, reply_strategy: str = "positive_only") -> Dict:
        """Automatically reply to comments based on strategy"""
        
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        # Define reply strategy
        reply_sentiments = []
        if reply_strategy == "positive_only":
            reply_sentiments = ["positive"]
        elif reply_strategy == "positive_neutral":
            reply_sentiments = ["positive", "neutral"]
        elif reply_strategy == "all":
            reply_sentiments = ["positive", "neutral", "negative"]
        
        # Get unreplied comments matching strategy
        unreplied_comments = db.query(Comment).filter(
            Comment.account_id == account_id,
            Comment.replied == False,
            Comment.sentiment.in_(reply_sentiments)
        ).limit(20).all()  # Limit to prevent spam
        
        replied_comments = []
        
        for comment in unreplied_comments:
            try:
                # Generate reply using AI
                reply_text = await self.ai_service.generate_comment_reply(
                    comment.comment_text,
                    comment.sentiment,
                    account.theme
                )
                
                # Post reply (mock)
                reply_result = await self.browser_service.reply_to_comment(
                    f"comment_{comment.id}",
                    reply_text
                )
                
                if reply_result["success"]:
                    # Update comment record
                    comment.replied = True
                    comment.reply_text = reply_text
                    
                    replied_comments.append({
                        "comment_id": comment.id,
                        "original_comment": comment.comment_text,
                        "reply": reply_text,
                        "sentiment": comment.sentiment
                    })
                
                # Add delay to mimic human behavior
                await asyncio.sleep(30)  # 30 second delay between replies
                
            except Exception as e:
                print(f"Error replying to comment {comment.id}: {e}")
                continue
        
        db.commit()
        
        return {
            "success": True,
            "replies_sent": len(replied_comments),
            "replies": replied_comments,
            "message": f"Sent {len(replied_comments)} auto-replies"
        }
    
    def get_comment_analytics(self, db: Session, account_id: int, days: int = 30) -> Dict:
        """Get comment analytics for the past N days"""
        
        from datetime import timedelta
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        comments = db.query(Comment).filter(
            Comment.account_id == account_id,
            Comment.created_at >= start_date,
            Comment.created_at <= end_date
        ).all()
        
        total_comments = len(comments)
        replied_comments = len([c for c in comments if c.replied])
        
        # Sentiment breakdown
        sentiment_stats = {
            "positive": len([c for c in comments if c.sentiment == "positive"]),
            "neutral": len([c for c in comments if c.sentiment == "neutral"]),
            "negative": len([c for c in comments if c.sentiment == "negative"])
        }
        
        # Response rate
        response_rate = (replied_comments / total_comments * 100) if total_comments > 0 else 0
        
        return {
            "period_days": days,
            "total_comments": total_comments,
            "replied_comments": replied_comments,
            "response_rate": round(response_rate, 2),
            "sentiment_breakdown": sentiment_stats,
            "average_comments_per_day": round(total_comments / days, 2)
        }
    
    def get_recent_comments(self, db: Session, account_id: int, limit: int = 50) -> List[Dict]:
        """Get recent comments for an account"""
        
        comments = db.query(Comment).filter(
            Comment.account_id == account_id
        ).order_by(Comment.created_at.desc()).limit(limit).all()
        
        return [
            {
                "id": comment.id,
                "post_id": comment.post_id,
                "username": comment.commenter_username,
                "text": comment.comment_text,
                "sentiment": comment.sentiment,
                "replied": comment.replied,
                "reply_text": comment.reply_text,
                "created_at": comment.created_at.isoformat()
            }
            for comment in comments
        ]
    
    async def bulk_engagement_action(self, db: Session, account_id: int, action: str = "like_recent") -> Dict:
        """Perform bulk engagement actions like liking recent posts"""
        
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        actions_performed = []
        
        if action == "like_recent":
            # Simulate liking recent posts from the feed
            for i in range(10):  # Like 10 posts
                await asyncio.sleep(5)  # Human-like delay
                
                # Mock liking action
                mock_post_id = f"external_post_{i}"
                actions_performed.append({
                    "action": "like",
                    "post_id": mock_post_id,
                    "success": True
                })
        
        elif action == "follow_users":
            # Simulate following users in the niche
            for i in range(5):  # Follow 5 users
                await asyncio.sleep(10)  # Longer delay for follows
                
                mock_user = f"user_in_{account.theme}_{i}"
                actions_performed.append({
                    "action": "follow",
                    "username": mock_user,
                    "success": True
                })
        
        return {
            "success": True,
            "actions_performed": len(actions_performed),
            "actions": actions_performed,
            "message": f"Performed {len(actions_performed)} {action} actions"
        }