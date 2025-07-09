import openai
import os
import json
import asyncio
from typing import Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

class OpenAIService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
    
    async def generate_content_strategy(self, theme: str, platform: str = "instagram") -> Dict:
        """Generate a comprehensive content strategy based on theme"""
        prompt = f"""
        Create a comprehensive {platform} content strategy for the theme: {theme}
        
        Please provide a detailed JSON response with the following structure:
        {{
            "theme": "{theme}",
            "target_audience": "description of target audience",
            "content_pillars": ["pillar1", "pillar2", "pillar3", "pillar4"],
            "posting_schedule": {{
                "frequency": "posts per week",
                "best_times": ["time1", "time2", "time3"],
                "days": ["Monday", "Tuesday", etc.]
            }},
            "hashtag_strategy": {{
                "primary_hashtags": ["#hashtag1", "#hashtag2"],
                "niche_hashtags": ["#hashtag3", "#hashtag4"],
                "trending_hashtags": ["#hashtag5", "#hashtag6"]
            }},
            "content_types": ["post_type1", "post_type2", "post_type3"],
            "engagement_tactics": ["tactic1", "tactic2", "tactic3"],
            "growth_goals": {{
                "monthly_follower_target": 1000,
                "engagement_rate_target": "5%"
            }}
        }}
        
        Make the strategy specific to {theme} and optimized for {platform}.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert social media strategist specializing in AI-driven content strategies."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content
            # Try to parse as JSON, fallback to structured text if needed
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                return {"strategy_text": content}
                
        except Exception as e:
            print(f"Error generating content strategy: {e}")
            return {"error": str(e)}

    async def generate_post_caption(self, theme: str, content_pillar: str, platform: str = "instagram") -> str:
        """Generate engaging captions for posts"""
        prompt = f"""
        Create an engaging {platform} caption for a {theme} account.
        Content pillar: {content_pillar}
        
        Requirements:
        - Hook the audience in the first line
        - Provide value related to {theme}
        - Include a call-to-action
        - Be authentic and engaging
        - Optimize for {platform}
        
        Return only the caption text, no additional formatting.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"You are an expert {platform} content creator specializing in {theme}."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=300
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating caption: {e}")
            return f"Check out this amazing {theme} content! 🔥"

    async def generate_hashtags(self, theme: str, caption: str, platform: str = "instagram") -> List[str]:
        """Generate relevant hashtags for a post"""
        prompt = f"""
        Generate 20-30 relevant hashtags for this {platform} post about {theme}.
        Caption: {caption}
        
        Mix of:
        - Popular hashtags (high reach)
        - Niche hashtags (targeted audience)
        - Trending hashtags (current relevance)
        
        Return as a comma-separated list of hashtags (include the # symbol).
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a hashtag expert for social media growth."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=300
            )
            
            hashtags_text = response.choices[0].message.content.strip()
            hashtags = [tag.strip() for tag in hashtags_text.split(',')]
            return hashtags[:25]  # Limit to 25 hashtags
            
        except Exception as e:
            print(f"Error generating hashtags: {e}")
            return [f"#{theme.lower()}", "#content", "#socialmedia"]

    async def generate_image_prompt(self, theme: str, content_description: str) -> str:
        """Generate DALL-E prompt for image creation"""
        prompt = f"""
        Create a detailed DALL-E prompt for generating an image related to {theme}.
        Content description: {content_description}
        
        Requirements:
        - High quality, professional look
        - Suitable for social media
        - Visually engaging
        - Related to {theme}
        
        Return only the DALL-E prompt, optimized for best results.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert at creating DALL-E prompts for social media content."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating image prompt: {e}")
            return f"Professional {theme} content, high quality, social media ready"

    async def generate_image(self, prompt: str, size: str = "1024x1024") -> Optional[str]:
        """Generate image using DALL-E"""
        try:
            response = await self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size=size,
                quality="standard",
                n=1
            )
            
            return response.data[0].url
            
        except Exception as e:
            print(f"Error generating image: {e}")
            return None

    async def analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment of comments for auto-reply"""
        prompt = f"""
        Analyze the sentiment of this comment: "{text}"
        
        Return only one word: "positive", "negative", or "neutral"
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a sentiment analysis expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=10
            )
            
            sentiment = response.choices[0].message.content.strip().lower()
            return sentiment if sentiment in ["positive", "negative", "neutral"] else "neutral"
            
        except Exception as e:
            print(f"Error analyzing sentiment: {e}")
            return "neutral"

    async def generate_comment_reply(self, comment_text: str, sentiment: str, theme: str) -> str:
        """Generate appropriate reply to comments"""
        prompt = f"""
        Generate a friendly, authentic reply to this {sentiment} comment on a {theme} account:
        Comment: "{comment_text}"
        
        Requirements:
        - Match the tone appropriately
        - Be engaging and authentic
        - Keep it concise
        - Include relevant emoji if appropriate
        - Maintain brand voice for {theme}
        
        Return only the reply text.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"You are managing a {theme} social media account. Be authentic and engaging."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=100
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Error generating reply: {e}")
            return "Thanks for your comment! 😊"