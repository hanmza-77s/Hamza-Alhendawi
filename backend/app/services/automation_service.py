import random
import asyncio
import time
from typing import List, Dict, Optional
from datetime import datetime, timedelta

class AutomationService:
    def __init__(self):
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
            "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
        ]
        
        self.proxy_list = [
            "proxy1.example.com:8080",
            "proxy2.example.com:8080",
            "proxy3.example.com:8080",
            "proxy4.example.com:8080",
            "proxy5.example.com:8080"
        ]
        
        self.current_proxy = None
        self.current_user_agent = None
    
    async def simulate_login(self, username: str, password: str, platform: str = "instagram") -> Dict:
        """Simulate logging into a social media platform."""
        try:
            # Rotate user agent and proxy
            await self._rotate_identity()
            
            # Simulate human-like delays
            await self._human_delay(2, 4)
            
            # Simulate typing
            await self._simulate_typing(username)
            await self._human_delay(1, 2)
            await self._simulate_typing(password)
            await self._human_delay(1, 2)
            
            # Simulate clicking login button
            await self._simulate_click()
            await self._human_delay(3, 6)
            
            # Simulate random success/failure (95% success rate)
            success = random.random() > 0.05
            
            if success:
                print(f"Successfully logged into {platform} as {username}")
                return {
                    "success": True,
                    "message": f"Successfully logged into {platform}",
                    "user_agent": self.current_user_agent,
                    "proxy": self.current_proxy
                }
            else:
                print(f"Failed to log into {platform} as {username}")
                return {
                    "success": False,
                    "message": "Login failed - please check credentials",
                    "user_agent": self.current_user_agent,
                    "proxy": self.current_proxy
                }
                
        except Exception as e:
            print(f"Error during login simulation: {e}")
            return {
                "success": False,
                "message": f"Login error: {str(e)}",
                "user_agent": self.current_user_agent,
                "proxy": self.current_proxy
            }
    
    async def simulate_post_creation(self, caption: str, hashtags: List[str], media_path: str) -> Dict:
        """Simulate creating and posting content."""
        try:
            # Rotate identity
            await self._rotate_identity()
            
            # Simulate opening post creation
            await self._human_delay(1, 3)
            await self._simulate_click()  # Click "New Post"
            
            # Simulate uploading media
            await self._human_delay(2, 4)
            print(f"Uploading media: {media_path}")
            
            # Simulate adding caption
            await self._human_delay(1, 2)
            await self._simulate_typing(caption)
            
            # Simulate adding hashtags
            if hashtags:
                await self._human_delay(1, 2)
                hashtag_text = " ".join(hashtags)
                await self._simulate_typing(hashtag_text)
            
            # Simulate final review and posting
            await self._human_delay(2, 4)
            await self._simulate_click()  # Click "Share"
            
            # Simulate posting delay
            await self._human_delay(3, 8)
            
            # Simulate success (90% success rate)
            success = random.random() > 0.1
            
            if success:
                print("Successfully posted content")
                return {
                    "success": True,
                    "message": "Content posted successfully",
                    "post_id": f"post_{int(time.time())}",
                    "user_agent": self.current_user_agent,
                    "proxy": self.current_proxy
                }
            else:
                print("Failed to post content")
                return {
                    "success": False,
                    "message": "Failed to post content",
                    "user_agent": self.current_user_agent,
                    "proxy": self.current_proxy
                }
                
        except Exception as e:
            print(f"Error during post creation simulation: {e}")
            return {
                "success": False,
                "message": f"Post creation error: {str(e)}",
                "user_agent": self.current_user_agent,
                "proxy": self.current_proxy
            }
    
    async def simulate_engagement(self, action_type: str = "like") -> Dict:
        """Simulate engaging with other content (likes, comments, follows)."""
        try:
            # Rotate identity
            await self._rotate_identity()
            
            # Simulate scrolling
            await self._simulate_scrolling()
            await self._human_delay(1, 3)
            
            # Simulate the engagement action
            if action_type == "like":
                await self._simulate_click()  # Click like button
                print("Liked a post")
            elif action_type == "comment":
                await self._simulate_click()  # Click comment button
                await self._human_delay(1, 2)
                comment = self._generate_random_comment()
                await self._simulate_typing(comment)
                await self._human_delay(1, 2)
                await self._simulate_click()  # Click post comment
                print(f"Commented: {comment}")
            elif action_type == "follow":
                await self._simulate_click()  # Click follow button
                print("Followed an account")
            
            await self._human_delay(2, 4)
            
            return {
                "success": True,
                "action": action_type,
                "message": f"Successfully performed {action_type} action",
                "user_agent": self.current_user_agent,
                "proxy": self.current_proxy
            }
            
        except Exception as e:
            print(f"Error during engagement simulation: {e}")
            return {
                "success": False,
                "action": action_type,
                "message": f"Engagement error: {str(e)}",
                "user_agent": self.current_user_agent,
                "proxy": self.current_proxy
            }
    
    async def simulate_story_viewing(self) -> Dict:
        """Simulate viewing stories."""
        try:
            # Rotate identity
            await self._rotate_identity()
            
            # Simulate clicking on stories
            await self._human_delay(1, 3)
            await self._simulate_click()  # Click on story
            
            # Simulate viewing story
            await self._human_delay(3, 8)
            
            # Simulate moving to next story
            await self._simulate_click()  # Click next
            await self._human_delay(2, 5)
            
            print("Viewed stories")
            
            return {
                "success": True,
                "action": "story_view",
                "message": "Successfully viewed stories",
                "user_agent": self.current_user_agent,
                "proxy": self.current_proxy
            }
            
        except Exception as e:
            print(f"Error during story viewing simulation: {e}")
            return {
                "success": False,
                "action": "story_view",
                "message": f"Story viewing error: {str(e)}",
                "user_agent": self.current_user_agent,
                "proxy": self.current_proxy
            }
    
    async def _rotate_identity(self):
        """Rotate user agent and proxy for anonymity."""
        self.current_user_agent = random.choice(self.user_agents)
        self.current_proxy = random.choice(self.proxy_list)
        print(f"Rotated identity - User Agent: {self.current_user_agent[:50]}..., Proxy: {self.current_proxy}")
    
    async def _human_delay(self, min_seconds: float, max_seconds: float):
        """Simulate human-like delays."""
        delay = random.uniform(min_seconds, max_seconds)
        await asyncio.sleep(delay)
    
    async def _simulate_typing(self, text: str):
        """Simulate human-like typing."""
        # Simulate typing speed (50-150 WPM)
        words = text.split()
        typing_delay = random.uniform(0.1, 0.3)  # seconds per word
        
        for word in words:
            await asyncio.sleep(typing_delay)
            # Add occasional longer pauses
            if random.random() < 0.1:  # 10% chance of longer pause
                await asyncio.sleep(random.uniform(0.5, 1.5))
    
    async def _simulate_click(self):
        """Simulate clicking on elements."""
        # Simulate mouse movement and click
        await asyncio.sleep(random.uniform(0.1, 0.3))
    
    async def _simulate_scrolling(self):
        """Simulate scrolling behavior."""
        # Simulate random scrolling patterns
        scroll_pauses = random.randint(2, 5)
        for _ in range(scroll_pauses):
            await asyncio.sleep(random.uniform(1, 3))
            # Simulate scroll action
            await asyncio.sleep(random.uniform(0.5, 1.5))
    
    def _generate_random_comment(self) -> str:
        """Generate a random comment for engagement."""
        comments = [
            "Great post! 👍",
            "Love this! ❤️",
            "Amazing content! 🔥",
            "Thanks for sharing! 🙏",
            "This is awesome! ✨",
            "Keep it up! 💪",
            "Inspiring! 🌟",
            "Beautiful! 😍",
            "So true! 💯",
            "Love the vibes! 🌈"
        ]
        return random.choice(comments)
    
    async def get_automation_stats(self) -> Dict:
        """Get statistics about automation activities."""
        return {
            "total_actions": random.randint(50, 200),
            "successful_actions": random.randint(45, 180),
            "failed_actions": random.randint(1, 20),
            "current_user_agent": self.current_user_agent,
            "current_proxy": self.current_proxy,
            "last_activity": datetime.now().isoformat(),
            "actions_today": {
                "likes": random.randint(10, 50),
                "comments": random.randint(5, 20),
                "follows": random.randint(2, 10),
                "posts": random.randint(1, 5)
            }
        }