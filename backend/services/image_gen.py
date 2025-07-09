import os, time, logging, requests
try:
    import openai
except ImportError:
    openai = None

from PIL import Image, ImageDraw, ImageFont

log = logging.getLogger(__name__)
MEDIA_DIR = "media"


def _openai_ready():
    return openai is not None and os.getenv("OPENAI_API_KEY")


def generate_image(theme: str) -> str:
    """Generate an image and save to media folder. Returns local path."""
    os.makedirs(MEDIA_DIR, exist_ok=True)
    filename = f"image_{int(time.time())}.png"
    path = os.path.join(MEDIA_DIR, filename)

    if _openai_ready():
        openai.api_key = os.getenv("OPENAI_API_KEY")
        resp = openai.Image.create(prompt=f"High quality instagram photo about {theme}", n=1, size="1024x1024")
        url = resp["data"][0]["url"]
        try:
            img_bytes = requests.get(url).content
            with open(path, "wb") as f:
                f.write(img_bytes)
            return path
        except Exception as e:
            log.error("Failed downloading OpenAI image: %s", e)

    # Fallback: create simple text image
    img = Image.new("RGB", (1024, 1024), color="white")
    draw = ImageDraw.Draw(img)
    text = theme.capitalize()
    try:
        font = ImageFont.truetype("arial.ttf", 80)
    except Exception:
        font = None
    w, h = draw.textsize(text, font=font)
    draw.text(((1024 - w) / 2, (1024 - h) / 2), text, fill="black", font=font)
    img.save(path)
    return path