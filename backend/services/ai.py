import os
import logging
from typing import Dict

try:
    import openai
except ImportError:  # OpenAI optional for mock mode
    openai = None

log = logging.getLogger(__name__)


def _openai_ready() -> bool:
    return openai is not None and os.getenv("OPENAI_API_KEY")


def generate_strategy(theme: str) -> str:
    """Return a high-level content strategy text."""
    if _openai_ready():
        openai.api_key = os.getenv("OPENAI_API_KEY")
        completion = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # cheaper but capable; adjust as needed
            messages=[
                {
                    "role": "user",
                    "content": f"Create a concise Instagram growth strategy for a {theme} account.",
                }
            ],
            max_tokens=200,
        )
        return completion.choices[0].message["content"].strip()

    log.warning("OpenAI not configured – returning mock strategy")
    return f"[Mock] Post daily {theme} tips, alternate reels & carousels, engage with comments."


def generate_post(theme: str) -> Dict:
    """Return caption, hashtags, image & video URLs (mock)."""
    if _openai_ready():
        # Simplified prompt for idea + caption
        prompt = (
            "Generate an engaging Instagram post idea about {theme}. "
            "Respond as JSON with keys: caption, hashtags (comma separated)."
        ).format(theme=theme)
        completion = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
        )
        import json

        try:
            base = json.loads(completion.choices[0].message["content"])
        except Exception:  # Fallback parse
            base = {
                "caption": completion.choices[0].message["content"].strip(),
                "hashtags": "",
            }
    else:
        base = {
            "caption": f"🔥 Amazing {theme} tip of the day!",
            "hashtags": "#autosocial #ai #content",
        }

    # Media generation (mock for now)
    base["image_url"] = f"https://placehold.co/600x600?text={theme}"
    base["video_url"] = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
    return base