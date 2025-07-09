import os
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from moviepy.editor import ImageClip, AudioFileClip, CompositeVideoClip, TextClip
from PIL import Image, ImageDraw, ImageFont
import requests
from backend.app.services.ai_service import AIService
from backend.app.core.config import settings

class ContentService:
    def __init__(self):
        self.ai_service = AIService()
        self.media_dir = "media"
        os.makedirs(self.media_dir, exist_ok=True)
    
    async def generate_complete_content(self, theme: str, content_type: str = "image") -> Dict:
        """Generate complete content including caption, hashtags, and media."""
        try:
            # Generate caption and hashtags
            caption = await self.ai_service.generate_caption(theme, content_type)
            hashtags = await self.ai_service.generate_hashtags(theme, 15)
            
            # Generate media
            if content_type == "image":
                media_path = await self.generate_image(theme)
            elif content_type == "video":
                media_path = await self.generate_video(theme)
            else:
                media_path = await self.generate_image(theme)
            
            return {
                "caption": caption,
                "hashtags": hashtags,
                "media_path": media_path,
                "content_type": content_type,
                "theme": theme,
                "generated_at": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error generating complete content: {e}")
            return self._mock_content(theme, content_type)
    
    async def generate_image(self, theme: str) -> str:
        """Generate an image for the given theme."""
        try:
            # Generate image prompt
            prompt = await self.ai_service.generate_image_prompt(theme, "post")
            
            # Generate image using AI service
            image_url = await self.ai_service.generate_image(prompt)
            
            # Download and save image
            filename = f"image_{theme}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            filepath = os.path.join(self.media_dir, filename)
            
            # In a real implementation, download the image from URL
            # For now, create a placeholder image
            await self._create_placeholder_image(filepath, theme)
            
            return filepath
        except Exception as e:
            print(f"Error generating image: {e}")
            return await self._create_placeholder_image(f"placeholder_{theme}.jpg", theme)
    
    async def generate_video(self, theme: str, duration: int = 15) -> str:
        """Generate a video for the given theme."""
        try:
            # Generate image for video
            image_path = await self.generate_image(theme)
            
            # Generate audio/music
            audio_path = await self.generate_audio(theme)
            
            # Create video from image and audio
            video_path = await self._create_video_from_image(image_path, audio_path, duration)
            
            return video_path
        except Exception as e:
            print(f"Error generating video: {e}")
            return await self._create_placeholder_video(theme, duration)
    
    async def generate_audio(self, theme: str) -> str:
        """Generate background music for videos."""
        try:
            # Mock audio generation (in real app, use Suno/Soundraw API)
            filename = f"audio_{theme}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"
            filepath = os.path.join(self.media_dir, filename)
            
            # Create a simple audio file (mock)
            await self._create_placeholder_audio(filepath, theme)
            
            return filepath
        except Exception as e:
            print(f"Error generating audio: {e}")
            return await self._create_placeholder_audio(f"placeholder_audio_{theme}.mp3", theme)
    
    async def create_content_batch(self, theme: str, count: int = 5) -> List[Dict]:
        """Create a batch of content for the given theme."""
        content_batch = []
        
        for i in range(count):
            content_type = random.choice(["image", "video"])
            content = await self.generate_complete_content(theme, content_type)
            content_batch.append(content)
        
        return content_batch
    
    async def _create_placeholder_image(self, filepath: str, theme: str) -> str:
        """Create a placeholder image for the theme."""
        try:
            # Create a simple placeholder image
            width, height = 1080, 1080
            image = Image.new('RGB', (width, height), color=self._get_theme_color(theme))
            draw = ImageDraw.Draw(image)
            
            # Add text
            try:
                font = ImageFont.truetype("arial.ttf", 60)
            except:
                font = ImageFont.load_default()
            
            text = f"{theme.upper()}\nCONTENT"
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            x = (width - text_width) // 2
            y = (height - text_height) // 2
            
            draw.text((x, y), text, fill="white", font=font)
            
            image.save(filepath)
            return filepath
        except Exception as e:
            print(f"Error creating placeholder image: {e}")
            return filepath
    
    async def _create_video_from_image(self, image_path: str, audio_path: str, duration: int) -> str:
        """Create a video from an image and audio."""
        try:
            # Load image
            image_clip = ImageClip(image_path, duration=duration)
            
            # Load audio
            audio_clip = AudioFileClip(audio_path)
            
            # Trim audio to match duration
            if audio_clip.duration > duration:
                audio_clip = audio_clip.subclip(0, duration)
            elif audio_clip.duration < duration:
                # Loop audio if shorter than duration
                loops_needed = int(duration / audio_clip.duration) + 1
                audio_clip = audio_clip.loop(loops_needed).subclip(0, duration)
            
            # Combine image and audio
            video_clip = image_clip.set_audio(audio_clip)
            
            # Generate output filename
            filename = f"video_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
            output_path = os.path.join(self.media_dir, filename)
            
            # Write video
            video_clip.write_videofile(output_path, fps=24, verbose=False, logger=None)
            
            # Clean up
            image_clip.close()
            audio_clip.close()
            video_clip.close()
            
            return output_path
        except Exception as e:
            print(f"Error creating video: {e}")
            return await self._create_placeholder_video("general", duration)
    
    async def _create_placeholder_video(self, theme: str, duration: int) -> str:
        """Create a placeholder video."""
        try:
            # Create a simple video with text
            filename = f"placeholder_video_{theme}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
            filepath = os.path.join(self.media_dir, filename)
            
            # Create a simple video using MoviePy
            clip = TextClip(f"{theme.upper()} CONTENT", fontsize=70, color='white', size=(1080, 1080))
            clip = clip.set_duration(duration).set_bgcolor(self._get_theme_color(theme))
            
            clip.write_videofile(filepath, fps=24, verbose=False, logger=None)
            clip.close()
            
            return filepath
        except Exception as e:
            print(f"Error creating placeholder video: {e}")
            return f"placeholder_video_{theme}.mp4"
    
    async def _create_placeholder_audio(self, filepath: str, theme: str) -> str:
        """Create a placeholder audio file."""
        try:
            # Create a simple audio file (mock)
            # In a real implementation, this would generate actual audio
            # For now, we'll just create an empty file
            with open(filepath, 'w') as f:
                f.write("placeholder_audio")
            
            return filepath
        except Exception as e:
            print(f"Error creating placeholder audio: {e}")
            return filepath
    
    def _get_theme_color(self, theme: str) -> str:
        """Get a color associated with the theme."""
        colors = {
            "boxing": "#FF6B6B",  # Red
            "health": "#4ECDC4",  # Teal
            "motivation": "#45B7D1",  # Blue
            "fitness": "#96CEB4",  # Green
            "lifestyle": "#FFEAA7"  # Yellow
        }
        return colors.get(theme, "#6C5CE7")  # Default purple
    
    def _mock_content(self, theme: str, content_type: str) -> Dict:
        """Return mock content when AI generation fails."""
        return {
            "caption": f"Amazing {theme} content! 💪 #motivation #success",
            "hashtags": ["#motivation", "#success", "#inspiration", "#goals"],
            "media_path": f"placeholder_{content_type}_{theme}.{content_type}",
            "content_type": content_type,
            "theme": theme,
            "generated_at": datetime.now().isoformat()
        }