import asyncio
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from backend.app.models.content import Content, ContentSchedule
from backend.app.models.account import SocialAccount

class SchedulerService:
    def __init__(self):
        self.running_tasks = {}
    
    async def schedule_content(self, content_id: int, scheduled_time: datetime, db: Session) -> Dict:
        """Schedule content for posting at a specific time."""
        try:
            # Create schedule entry
            schedule = ContentSchedule(
                content_id=content_id,
                scheduled_time=scheduled_time,
                status="pending"
            )
            
            db.add(schedule)
            db.commit()
            db.refresh(schedule)
            
            # Schedule the actual posting task
            task = asyncio.create_task(
                self._execute_scheduled_post(schedule.id, db)
            )
            self.running_tasks[schedule.id] = task
            
            return {
                "schedule_id": schedule.id,
                "content_id": content_id,
                "scheduled_time": scheduled_time.isoformat(),
                "status": "scheduled"
            }
        except Exception as e:
            print(f"Error scheduling content: {e}")
            return {"error": str(e)}
    
    async def schedule_content_batch(self, contents: List[Dict], account_id: int, db: Session) -> List[Dict]:
        """Schedule multiple content pieces with smart timing."""
        try:
            schedules = []
            
            # Get account settings
            account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
            if not account:
                raise ValueError("Account not found")
            
            # Calculate posting times based on theme and best practices
            posting_times = self._calculate_posting_times(len(contents), account.theme)
            
            for i, content in enumerate(contents):
                if i < len(posting_times):
                    scheduled_time = posting_times[i]
                    
                    # Create content record
                    content_record = Content(
                        account_id=account_id,
                        content_type=content.get("content_type", "image"),
                        caption=content.get("caption", ""),
                        hashtags=content.get("hashtags", []),
                        media_path=content.get("media_path", ""),
                        ai_generated=True,
                        status="scheduled"
                    )
                    
                    db.add(content_record)
                    db.commit()
                    db.refresh(content_record)
                    
                    # Schedule the content
                    schedule_result = await self.schedule_content(
                        content_record.id, 
                        scheduled_time, 
                        db
                    )
                    
                    schedules.append(schedule_result)
            
            return schedules
        except Exception as e:
            print(f"Error scheduling content batch: {e}")
            return [{"error": str(e)}]
    
    async def _execute_scheduled_post(self, schedule_id: int, db: Session):
        """Execute a scheduled post."""
        try:
            # Get schedule
            schedule = db.query(ContentSchedule).filter(ContentSchedule.id == schedule_id).first()
            if not schedule:
                return
            
            # Wait until scheduled time
            now = datetime.now()
            if schedule.scheduled_time > now:
                wait_seconds = (schedule.scheduled_time - now).total_seconds()
                await asyncio.sleep(wait_seconds)
            
            # Update status to publishing
            schedule.status = "publishing"
            db.commit()
            
            # Simulate posting delay
            await asyncio.sleep(random.uniform(2, 5))
            
            # Execute the actual post (simulated)
            success = await self._publish_post(schedule.content_id, db)
            
            if success:
                schedule.status = "published"
                schedule.published_time = datetime.now()
            else:
                schedule.status = "failed"
                schedule.error_message = "Failed to publish post"
            
            db.commit()
            
        except Exception as e:
            print(f"Error executing scheduled post: {e}")
            # Update schedule status to failed
            schedule = db.query(ContentSchedule).filter(ContentSchedule.id == schedule_id).first()
            if schedule:
                schedule.status = "failed"
                schedule.error_message = str(e)
                db.commit()
    
    async def _publish_post(self, content_id: int, db: Session) -> bool:
        """Publish a post to social media (simulated)."""
        try:
            # Get content
            content = db.query(Content).filter(Content.id == content_id).first()
            if not content:
                return False
            
            # Simulate posting process
            print(f"Publishing post {content_id} to social media...")
            
            # Simulate random success/failure (90% success rate)
            success = random.random() > 0.1
            
            if success:
                # Update content status
                content.status = "published"
                
                # Simulate engagement metrics
                content.engagement_metrics = {
                    "likes": random.randint(10, 100),
                    "comments": random.randint(0, 20),
                    "shares": random.randint(0, 10),
                    "reach": random.randint(100, 1000)
                }
                
                db.commit()
                print(f"Successfully published post {content_id}")
            else:
                print(f"Failed to publish post {content_id}")
            
            return success
            
        except Exception as e:
            print(f"Error publishing post: {e}")
            return False
    
    def _calculate_posting_times(self, content_count: int, theme: str) -> List[datetime]:
        """Calculate optimal posting times based on theme and content count."""
        posting_times = []
        now = datetime.now()
        
        # Best posting times by theme
        best_times = {
            "boxing": ["06:00", "12:00", "18:00", "20:00"],
            "health": ["07:00", "12:00", "17:00", "19:00"],
            "motivation": ["06:00", "12:00", "18:00", "21:00"],
            "fitness": ["06:00", "12:00", "17:00", "19:00"],
            "lifestyle": ["08:00", "12:00", "18:00", "20:00"]
        }
        
        times = best_times.get(theme, best_times["motivation"])
        
        for i in range(content_count):
            # Calculate days ahead (spread posts over multiple days)
            days_ahead = i // len(times)
            time_index = i % len(times)
            
            # Get the time string
            time_str = times[time_index]
            hour, minute = map(int, time_str.split(":"))
            
            # Calculate the posting time
            posting_time = now + timedelta(days=days_ahead)
            posting_time = posting_time.replace(hour=hour, minute=minute, second=0, microsecond=0)
            
            # Add some randomness to avoid exact timing
            random_minutes = random.randint(-15, 15)
            posting_time += timedelta(minutes=random_minutes)
            
            posting_times.append(posting_time)
        
        return posting_times
    
    async def get_scheduled_posts(self, account_id: int, db: Session) -> List[Dict]:
        """Get all scheduled posts for an account."""
        try:
            # Get content for this account
            contents = db.query(Content).filter(Content.account_id == account_id).all()
            content_ids = [content.id for content in contents]
            
            # Get schedules for these contents
            schedules = db.query(ContentSchedule).filter(
                ContentSchedule.content_id.in_(content_ids)
            ).all()
            
            result = []
            for schedule in schedules:
                content = next((c for c in contents if c.id == schedule.content_id), None)
                if content:
                    result.append({
                        "schedule_id": schedule.id,
                        "content_id": schedule.content_id,
                        "scheduled_time": schedule.scheduled_time.isoformat(),
                        "published_time": schedule.published_time.isoformat() if schedule.published_time else None,
                        "status": schedule.status,
                        "caption": content.caption,
                        "content_type": content.content_type,
                        "error_message": schedule.error_message
                    })
            
            return result
        except Exception as e:
            print(f"Error getting scheduled posts: {e}")
            return []
    
    async def cancel_scheduled_post(self, schedule_id: int, db: Session) -> bool:
        """Cancel a scheduled post."""
        try:
            schedule = db.query(ContentSchedule).filter(ContentSchedule.id == schedule_id).first()
            if not schedule:
                return False
            
            # Cancel the running task if it exists
            if schedule_id in self.running_tasks:
                self.running_tasks[schedule_id].cancel()
                del self.running_tasks[schedule_id]
            
            # Update status
            schedule.status = "cancelled"
            db.commit()
            
            return True
        except Exception as e:
            print(f"Error cancelling scheduled post: {e}")
            return False