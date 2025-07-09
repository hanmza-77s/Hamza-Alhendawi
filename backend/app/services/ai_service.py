import openai
import json
import random
from typing import List, Dict, Optional
from backend.app.core.config import settings

class AIService:
    def __init__(self):
        if settings.openai_api_key:
            openai.api_key = settings.openai_api_key
        else:
            print("Warning: OpenAI API key not set. Using mock responses.")
    
    async def generate_content_strategy(self, theme: str) -> Dict:
        """Generate a complete content strategy for the given theme."""
        if not settings.openai_api_key:
            return self._mock_content_strategy(theme)
        
        try:
            prompt = f"""
            Create a comprehensive content strategy for a {theme} Instagram account.
            Include:
            1. Content pillars (3-5 main themes)
            2. Posting frequency recommendations
            3. Best posting times
            4. Target audience description
            5. Brand voice guidelines
            6. Hashtag strategy
            
            Return as JSON with these keys: content_pillars, posting_frequency, 
            best_times, target_audience, brand_voice, hashtag_strategy
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error generating content strategy: {e}")
            return self._mock_content_strategy(theme)
    
    async def generate_caption(self, theme: str, content_type: str = "image") -> str:
        """Generate an engaging caption for the given theme and content type."""
        if not settings.openai_api_key:
            return self._mock_caption(theme, content_type)
        
        try:
            prompt = f"""
            Create an engaging Instagram caption for a {theme} account.
            Content type: {content_type}
            
            Requirements:
            - 150-200 characters
            - Include relevant emojis
            - Engaging and authentic tone
            - Include a call-to-action
            - Match the {theme} theme
            
            Return only the caption text.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating caption: {e}")
            return self._mock_caption(theme, content_type)
    
    async def generate_hashtags(self, theme: str, count: int = 15) -> List[str]:
        """Generate relevant hashtags for the theme."""
        if not settings.openai_api_key:
            return self._mock_hashtags(theme, count)
        
        try:
            prompt = f"""
            Generate {count} relevant Instagram hashtags for a {theme} account.
            Include a mix of:
            - Popular hashtags (1M+ posts)
            - Medium hashtags (100K-1M posts)
            - Niche hashtags (10K-100K posts)
            
            Return as a JSON array of hashtag strings.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error generating hashtags: {e}")
            return self._mock_hashtags(theme, count)
    
    async def generate_image_prompt(self, theme: str, content_type: str = "post") -> str:
        """Generate a DALL-E prompt for image generation."""
        if not settings.openai_api_key:
            return self._mock_image_prompt(theme, content_type)
        
        try:
            prompt = f"""
            Create a detailed DALL-E image prompt for a {theme} Instagram {content_type}.
            
            Requirements:
            - High quality, professional look
            - Suitable for {theme} theme
            - Instagram-friendly aspect ratio
            - Engaging and visually appealing
            - Include style specifications
            
            Return only the image prompt.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating image prompt: {e}")
            return self._mock_image_prompt(theme, content_type)
    
    async def generate_image(self, prompt: str) -> Optional[str]:
        """Generate an image using DALL-E and return the file path."""
        if not settings.openai_api_key:
            return self._mock_generate_image(prompt)
        
        try:
            response = openai.Image.create(
                prompt=prompt,
                n=1,
                size="1080x1080"
            )
            
            # In a real implementation, you would download and save the image
            # For now, return the URL
            return response['data'][0]['url']
        except Exception as e:
            print(f"Error generating image: {e}")
            return self._mock_generate_image(prompt)
    
    async def generate_comment_reply(self, comment: str, theme: str) -> str:
        """Generate an AI reply to a comment based on sentiment and theme."""
        if not settings.openai_api_key:
            return self._mock_comment_reply(comment, theme)
        
        try:
            prompt = f"""
            Generate a friendly and engaging reply to this Instagram comment: "{comment}"
            
            Context: This is a {theme} account
            Requirements:
            - Keep it under 100 characters
            - Be authentic and engaging
            - Match the {theme} theme
            - Use appropriate emojis
            - Be positive and encouraging
            
            Return only the reply text.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating comment reply: {e}")
            return self._mock_comment_reply(comment, theme)
    
    # Mock methods for when API key is not available
    def _mock_content_strategy(self, theme: str) -> Dict:
        strategies = {
            "boxing": {
                "content_pillars": ["Training Tips", "Fight Highlights", "Motivation", "Boxing History"],
                "posting_frequency": "3-5 posts per week",
                "best_times": ["6-8 AM", "12-2 PM", "6-8 PM"],
                "target_audience": "Boxing enthusiasts, fitness lovers, athletes",
                "brand_voice": "Motivational, educational, authentic",
                "hashtag_strategy": "Mix of boxing, fitness, and motivational hashtags"
            },
            "health": {
                "content_pillars": ["Nutrition Tips", "Workout Routines", "Wellness", "Healthy Recipes"],
                "posting_frequency": "4-6 posts per week",
                "best_times": ["7-9 AM", "12-1 PM", "5-7 PM"],
                "target_audience": "Health-conscious individuals, fitness enthusiasts",
                "brand_voice": "Educational, encouraging, evidence-based",
                "hashtag_strategy": "Health, fitness, and wellness hashtags"
            },
            "motivation": {
                "content_pillars": ["Daily Motivation", "Success Stories", "Goal Setting", "Mindset"],
                "posting_frequency": "5-7 posts per week",
                "best_times": ["6-8 AM", "12-2 PM", "6-8 PM"],
                "target_audience": "Goal-oriented individuals, self-improvement seekers",
                "brand_voice": "Inspirational, empowering, authentic",
                "hashtag_strategy": "Motivation, success, and personal development hashtags"
            }
        }
        return strategies.get(theme, strategies["motivation"])
    
    def _mock_caption(self, theme: str, content_type: str) -> str:
        captions = {
            "boxing": [
                "🥊 Every punch is a step closer to greatness. Keep fighting! 💪 #BoxingLife #Motivation",
                "🔥 Today's training session was intense! Remember, champions are made in practice. #Boxing #Fitness",
                "💪 Boxing isn't just about fighting—it's about discipline, focus, and never giving up. #BoxingMotivation"
            ],
            "health": [
                "🌱 Your health is an investment, not an expense. Start today! 💚 #HealthyLiving #Wellness",
                "💪 Small changes lead to big results. What's your health goal today? #Fitness #Motivation",
                "🥗 Fuel your body with what it deserves. Healthy choices = happy life! #Nutrition #Health"
            ],
            "motivation": [
                "✨ Your potential is limitless. Believe in yourself and take action! #Motivation #Success",
                "🚀 Every expert was once a beginner. Keep pushing forward! #Growth #Mindset",
                "💎 Diamonds are made under pressure. You're stronger than you think! #Motivation #Resilience"
            ]
        }
        return random.choice(captions.get(theme, captions["motivation"]))
    
    def _mock_hashtags(self, theme: str, count: int) -> List[str]:
        hashtags = {
            "boxing": ["#boxing", "#boxinglife", "#boxingtraining", "#boxingmotivation", "#boxingcommunity", "#boxingworkout", "#boxingfitness", "#boxinglove", "#boxingpassion", "#boxinggoals", "#boxingfamily", "#boxingworld", "#boxingdaily", "#boxinginspiration", "#boxingstrong"],
            "health": ["#health", "#healthy", "#wellness", "#fitness", "#nutrition", "#healthylifestyle", "#healthyliving", "#wellbeing", "#healthgoals", "#healthmotivation", "#healthtips", "#healthylife", "#healthcoach", "#healthjourney", "#healthfirst"],
            "motivation": ["#motivation", "#motivational", "#inspiration", "#mindset", "#success", "#goals", "#motivated", "#inspirational", "#motivationalquotes", "#successmindset", "#motivationmonday", "#motivationalpost", "#motivationalalspeaker", "#motivationalcontent", "#motivationalwords"]
        }
        return random.sample(hashtags.get(theme, hashtags["motivation"]), min(count, len(hashtags.get(theme, hashtags["motivation"]))))
    
    def _mock_image_prompt(self, theme: str, content_type: str) -> str:
        prompts = {
            "boxing": "Professional boxing gloves on a dark background, dramatic lighting, high quality, Instagram post",
            "health": "Fresh vegetables and fruits arranged beautifully, natural lighting, healthy lifestyle, Instagram post",
            "motivation": "Sunrise over mountains, inspirational quote overlay, motivational, Instagram post"
        }
        return prompts.get(theme, prompts["motivation"])
    
    def _mock_generate_image(self, prompt: str) -> str:
        # Return a placeholder image URL
        return "https://via.placeholder.com/1080x1080/FF6B6B/FFFFFF?text=AI+Generated+Image"
    
    def _mock_comment_reply(self, comment: str, theme: str) -> str:
        replies = [
            "Thanks for the support! 🙏",
            "Appreciate you! 💪",
            "You're awesome! ✨",
            "Thanks for the love! ❤️",
            "You got this! 🔥"
        ]
        return random.choice(replies)