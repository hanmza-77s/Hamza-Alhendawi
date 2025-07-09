import os, time, logging
from typing import Optional

log = logging.getLogger(__name__)
MEDIA_DIR = "media"


def compose_video(image_path: str, music_path: Optional[str] = None, caption: str | None = None, duration: int = 5) -> str:
    """Combine image and audio into a short mp4. Returns local path."""
    os.makedirs(MEDIA_DIR, exist_ok=True)
    filename = f"video_{int(time.time())}.mp4"
    output_path = os.path.join(MEDIA_DIR, filename)

    try:
        from moviepy.editor import ImageClip, AudioFileClip, TextClip, CompositeVideoClip

        clip = ImageClip(image_path).set_duration(duration).resize(height=720)

        if caption:
            txt = TextClip(caption, fontsize=48, color='white', font='Arial-Bold').set_position('bottom').set_duration(duration)
            clip = CompositeVideoClip([clip, txt])
        if music_path and os.path.exists(music_path):
            try:
                audio = AudioFileClip(music_path).set_duration(duration)
                clip = clip.set_audio(audio)
            except Exception as e:
                log.warning("Failed to attach audio: %s", e)
        clip.write_videofile(output_path, fps=24, audio_codec='aac', logger=None)
        return output_path
    except Exception as e:
        log.error("MoviePy compose failed: %s", e)
        # Fallback: return image path (client can display image instead of video)
        return image_path