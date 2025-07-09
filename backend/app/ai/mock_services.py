import asyncio
import random
from typing import Dict, List, Optional
import json

class MockVideoService:
    """Mock service for video generation (replace with real service like Runway API)"""
    
    async def generate_video(self, image_url: str, music_url: str, caption: str, theme: str) -> Optional[str]:
        """Mock video generation"""
        # Simulate API processing time
        await asyncio.sleep(2)
        
        # Mock video URL (in production, this would be from actual video generation)
        video_id = f"video_{random.randint(1000, 9999)}"
        mock_video_url = f"https://mock-storage.com/videos/{video_id}.mp4"
        
        print(f"Mock: Generated video for theme '{theme}' with image: {image_url}")
        return mock_video_url
    
    async def create_slideshow_video(self, images: List[str], music_url: str, duration: int = 15) -> Optional[str]:
        """Create a slideshow video from multiple images"""
        await asyncio.sleep(3)
        
        video_id = f"slideshow_{random.randint(1000, 9999)}"
        mock_video_url = f"https://mock-storage.com/slideshows/{video_id}.mp4"
        
        print(f"Mock: Created slideshow with {len(images)} images")
        return mock_video_url

class MockMusicService:
    """Mock service for music generation (replace with Suno/Soundraw API)"""
    
    async def generate_background_music(self, theme: str, mood: str = "energetic", duration: int = 30) -> Optional[str]:
        """Generate background music for videos"""
        await asyncio.sleep(2)
        
        # Mock music styles based on theme
        music_styles = {
            "boxing": ["intense", "powerful", "motivational"],
            "health": ["uplifting", "calm", "inspiring"],
            "motivation": ["energetic", "powerful", "upbeat"],
            "fitness": ["high-energy", "driving", "motivational"],
            "lifestyle": ["chill", "modern", "trendy"]
        }
        
        style = random.choice(music_styles.get(theme.lower(), ["upbeat", "modern"]))
        music_id = f"music_{random.randint(1000, 9999)}"
        mock_music_url = f"https://mock-storage.com/music/{music_id}.mp3"
        
        print(f"Mock: Generated {style} music for {theme} theme")
        return mock_music_url
    
    async def get_trending_sounds(self, platform: str = "instagram") -> List[Dict]:
        """Get trending audio/music for platform"""
        # Mock trending sounds
        trending_sounds = [
            {
                "id": "trending_1",
                "title": "Viral Beat 2024",
                "url": "https://mock-storage.com/trending/beat1.mp3",
                "usage_count": 15000,
                "category": "trending"
            },
            {
                "id": "trending_2", 
                "title": "Motivational Rise",
                "url": "https://mock-storage.com/trending/motiv1.mp3",
                "usage_count": 12000,
                "category": "motivational"
            },
            {
                "id": "trending_3",
                "title": "Workout Energy",
                "url": "https://mock-storage.com/trending/workout1.mp3", 
                "usage_count": 18000,
                "category": "fitness"
            }
        ]
        
        await asyncio.sleep(1)
        return trending_sounds

class MockProxyService:
    """Mock service for proxy rotation and human-like behavior"""
    
    def __init__(self):
        self.proxy_pool = [
            {"ip": "192.168.1.10", "port": 8080, "country": "US"},
            {"ip": "192.168.1.11", "port": 8080, "country": "UK"}, 
            {"ip": "192.168.1.12", "port": 8080, "country": "CA"}
        ]
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
        ]
    
    def get_random_proxy(self) -> Dict:
        """Get a random proxy from the pool"""
        return random.choice(self.proxy_pool)
    
    def get_random_user_agent(self) -> str:
        """Get a random user agent"""
        return random.choice(self.user_agents)
    
    def get_random_delay(self, min_delay: int = 5, max_delay: int = 30) -> int:
        """Get random delay to mimic human behavior"""
        return random.randint(min_delay, max_delay)
    
    async def simulate_human_scrolling(self) -> Dict:
        """Simulate human-like scrolling behavior"""
        await asyncio.sleep(random.uniform(0.5, 2.0))
        
        scroll_data = {
            "scroll_distance": random.randint(100, 500),
            "scroll_speed": random.uniform(50, 200),
            "pause_duration": random.uniform(0.5, 3.0),
            "direction": random.choice(["up", "down"])
        }
        
        return scroll_data

class MockBrowserAutomation:
    """Mock browser automation service (replace with Playwright)"""
    
    def __init__(self):
        self.proxy_service = MockProxyService()
        self.is_logged_in = False
    
    async def login_to_platform(self, username: str, password: str, platform: str = "instagram") -> Dict:
        """Mock login to social platform"""
        await asyncio.sleep(3)  # Simulate login time
        
        # Mock different login scenarios
        success_rate = 0.9  # 90% success rate
        
        if random.random() < success_rate:
            self.is_logged_in = True
            return {
                "success": True,
                "message": f"Successfully logged into {platform}",
                "account_info": {
                    "username": username,
                    "followers": random.randint(100, 1000),
                    "following": random.randint(50, 500),
                    "posts": random.randint(10, 100)
                }
            }
        else:
            return {
                "success": False,
                "message": "Login failed - please check credentials",
                "error": "Invalid username or password"
            }
    
    async def post_content(self, caption: str, media_urls: List[str], hashtags: str) -> Dict:
        """Mock posting content to platform"""
        if not self.is_logged_in:
            return {"success": False, "error": "Not logged in"}
        
        await asyncio.sleep(5)  # Simulate posting time
        
        post_id = f"post_{random.randint(100000, 999999)}"
        
        return {
            "success": True,
            "post_id": post_id,
            "url": f"https://instagram.com/p/{post_id}",
            "scheduled_time": None,
            "engagement": {
                "likes": random.randint(10, 100),
                "comments": random.randint(0, 20),
                "shares": random.randint(0, 5)
            }
        }
    
    async def get_comments(self, post_id: str) -> List[Dict]:
        """Mock getting comments from a post"""
        await asyncio.sleep(2)
        
        mock_comments = [
            {
                "id": f"comment_{random.randint(1000, 9999)}",
                "username": f"user_{random.randint(1, 100)}",
                "text": "Great content! Love this!",
                "timestamp": "2024-01-01T10:00:00Z",
                "likes": random.randint(0, 50)
            },
            {
                "id": f"comment_{random.randint(1000, 9999)}",
                "username": f"user_{random.randint(1, 100)}",
                "text": "This is amazing, keep it up!",
                "timestamp": "2024-01-01T10:05:00Z", 
                "likes": random.randint(0, 30)
            }
        ]
        
        return mock_comments
    
    async def reply_to_comment(self, comment_id: str, reply_text: str) -> Dict:
        """Mock replying to a comment"""
        await asyncio.sleep(2)
        
        return {
            "success": True,
            "reply_id": f"reply_{random.randint(1000, 9999)}",
            "comment_id": comment_id,
            "reply_text": reply_text
        }