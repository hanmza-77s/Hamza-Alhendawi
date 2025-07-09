from sqlalchemy.orm import Session
from app.models.models import ContentPost, ScheduledTask, SocialAccount, ContentStrategy
from app.ai.mock_services import MockBrowserAutomation
from typing import Dict, List
from datetime import datetime, timedelta
import asyncio
import random

class SchedulerService:
    def __init__(self):
        self.browser_service = MockBrowserAutomation()
    
    def schedule_post(self, db: Session, post_id: int, scheduled_time: datetime) -> Dict:
        """Schedule a post for future publishing"""
        
        post = db.query(ContentPost).filter(ContentPost.id == post_id).first()
        if not post:
            return {"success": False, "error": "Post not found"}
        
        if post.status == "posted":
            return {"success": False, "error": "Post already published"}
        
        # Update post with scheduled time
        post.scheduled_time = scheduled_time
        post.status = "scheduled"
        
        # Create scheduled task
        scheduled_task = ScheduledTask(
            account_id=post.account_id,
            task_type="post",
            task_data={
                "post_id": post_id,
                "action": "publish_post"
            },
            scheduled_time=scheduled_time
        )
        
        db.add(scheduled_task)
        db.commit()
        
        return {
            "success": True,
            "scheduled_time": scheduled_time.isoformat(),
            "message": f"Post scheduled for {scheduled_time.strftime('%Y-%m-%d %H:%M')}"
        }
    
    def schedule_optimal_times(self, db: Session, account_id: int, post_ids: List[int]) -> Dict:
        """Schedule posts at optimal times based on strategy"""
        
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        strategy = db.query(ContentStrategy).filter(ContentStrategy.account_id == account_id).first()
        
        # Default optimal times if no strategy
        optimal_times = ["09:00", "13:00", "18:00", "21:00"]
        optimal_days = [0, 1, 2, 3, 4, 5, 6]  # Monday to Sunday
        
        if strategy and strategy.posting_schedule:
            schedule = strategy.posting_schedule
            optimal_times = schedule.get("best_times", optimal_times)
            # Convert day names to numbers if needed
            days = schedule.get("days", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
            day_map = {"Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6}
            optimal_days = [day_map.get(day, i) for i, day in enumerate(days)]
        
        scheduled_posts = []
        current_time = datetime.utcnow()
        
        for i, post_id in enumerate(post_ids):
            # Calculate next optimal posting time
            days_ahead = i % len(optimal_days)
            target_day = optimal_days[i % len(optimal_days)]
            
            # Find next occurrence of target day
            days_until_target = (target_day - current_time.weekday()) % 7
            if days_until_target == 0 and i > 0:
                days_until_target = 7  # Next week if same day
            
            target_date = current_time + timedelta(days=days_until_target + (i // len(optimal_days)) * 7)
            
            # Choose random optimal time
            optimal_time = random.choice(optimal_times)
            hour, minute = map(int, optimal_time.split(":"))
            
            scheduled_time = target_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            
            # Add some randomization (±30 minutes)
            random_minutes = random.randint(-30, 30)
            scheduled_time += timedelta(minutes=random_minutes)
            
            result = self.schedule_post(db, post_id, scheduled_time)
            if result["success"]:
                scheduled_posts.append({
                    "post_id": post_id,
                    "scheduled_time": scheduled_time.isoformat()
                })
        
        return {
            "success": True,
            "scheduled_posts": scheduled_posts,
            "message": f"Scheduled {len(scheduled_posts)} posts at optimal times"
        }
    
    async def publish_scheduled_posts(self, db: Session) -> Dict:
        """Check and publish posts that are scheduled for now"""
        
        current_time = datetime.utcnow()
        
        # Find posts scheduled for publishing
        scheduled_tasks = db.query(ScheduledTask).filter(
            ScheduledTask.task_type == "post",
            ScheduledTask.status == "pending",
            ScheduledTask.scheduled_time <= current_time
        ).all()
        
        published_posts = []
        failed_posts = []
        
        for task in scheduled_tasks:
            try:
                post_id = task.task_data.get("post_id")
                post = db.query(ContentPost).filter(ContentPost.id == post_id).first()
                
                if not post:
                    task.status = "failed"
                    task.result = {"error": "Post not found"}
                    continue
                
                # Simulate posting process
                result = await self.browser_service.post_content(
                    post.caption,
                    post.media_urls or [],
                    post.hashtags or ""
                )
                
                if result["success"]:
                    # Update post status
                    post.status = "posted"
                    post.posted_time = current_time
                    post.engagement_stats = result.get("engagement", {})
                    
                    # Update task
                    task.status = "completed"
                    task.result = result
                    
                    published_posts.append({
                        "post_id": post_id,
                        "platform_post_id": result.get("post_id"),
                        "url": result.get("url")
                    })
                else:
                    task.status = "failed"
                    task.result = result
                    failed_posts.append({"post_id": post_id, "error": result.get("error")})
                
            except Exception as e:
                task.status = "failed"
                task.result = {"error": str(e)}
                failed_posts.append({"post_id": post_id, "error": str(e)})
        
        db.commit()
        
        return {
            "success": True,
            "published_posts": published_posts,
            "failed_posts": failed_posts,
            "message": f"Published {len(published_posts)} posts, {len(failed_posts)} failed"
        }
    
    def get_scheduled_posts(self, db: Session, account_id: int) -> List[Dict]:
        """Get all scheduled posts for an account"""
        
        posts = db.query(ContentPost).filter(
            ContentPost.account_id == account_id,
            ContentPost.status == "scheduled"
        ).order_by(ContentPost.scheduled_time).all()
        
        return [
            {
                "id": post.id,
                "title": post.title,
                "scheduled_time": post.scheduled_time.isoformat() if post.scheduled_time else None,
                "content_type": post.content_type,
                "caption": post.caption[:100] + "..." if len(post.caption) > 100 else post.caption
            }
            for post in posts
        ]
    
    def cancel_scheduled_post(self, db: Session, post_id: int) -> Dict:
        """Cancel a scheduled post"""
        
        post = db.query(ContentPost).filter(ContentPost.id == post_id).first()
        if not post:
            return {"success": False, "error": "Post not found"}
        
        if post.status != "scheduled":
            return {"success": False, "error": "Post is not scheduled"}
        
        # Update post status
        post.status = "draft"
        post.scheduled_time = None
        
        # Cancel related scheduled task
        task = db.query(ScheduledTask).filter(
            ScheduledTask.task_data["post_id"].astext == str(post_id),
            ScheduledTask.status == "pending"
        ).first()
        
        if task:
            task.status = "cancelled"
        
        db.commit()
        
        return {
            "success": True,
            "message": "Post scheduling cancelled"
        }
    
    def get_posting_analytics(self, db: Session, account_id: int, days: int = 30) -> Dict:
        """Get posting analytics for the past N days"""
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        posts = db.query(ContentPost).filter(
            ContentPost.account_id == account_id,
            ContentPost.posted_time >= start_date,
            ContentPost.posted_time <= end_date
        ).all()
        
        total_posts = len(posts)
        total_likes = sum(post.engagement_stats.get("likes", 0) for post in posts if post.engagement_stats)
        total_comments = sum(post.engagement_stats.get("comments", 0) for post in posts if post.engagement_stats)
        
        avg_engagement = (total_likes + total_comments) / total_posts if total_posts > 0 else 0
        
        # Group by content type
        content_type_stats = {}
        for post in posts:
            content_type = post.content_type
            if content_type not in content_type_stats:
                content_type_stats[content_type] = {"count": 0, "likes": 0, "comments": 0}
            
            content_type_stats[content_type]["count"] += 1
            if post.engagement_stats:
                content_type_stats[content_type]["likes"] += post.engagement_stats.get("likes", 0)
                content_type_stats[content_type]["comments"] += post.engagement_stats.get("comments", 0)
        
        return {
            "period_days": days,
            "total_posts": total_posts,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "average_engagement": round(avg_engagement, 2),
            "content_type_performance": content_type_stats,
            "posts_per_day": round(total_posts / days, 2)
        }