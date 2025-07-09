import os, time, wave, logging, contextlib
import math, struct

try:
    import numpy as np
except ImportError:
    np = None

log = logging.getLogger(__name__)
MEDIA_DIR = "media"


def generate_music(theme: str, duration: int = 5) -> str:
    """Generate (mock) music file and return local path."""
    os.makedirs(MEDIA_DIR, exist_ok=True)
    filename = f"music_{int(time.time())}.wav"
    path = os.path.join(MEDIA_DIR, filename)

    framerate = 44100
    amplitude = 32767
    frequency = 440  # A4 tone as placeholder

    with contextlib.closing(wave.open(path, 'w')) as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(framerate)

        if np is not None:
            t = np.linspace(0, duration, int(framerate * duration), False)
            tone = np.sin(frequency * 2 * np.pi * t)
            audio = (amplitude * tone).astype(np.int16)
            f.writeframes(audio.tobytes())
        else:
            # fallback: manual sample loop
            for i in range(int(duration * framerate)):
                value = int(amplitude * math.sin(2 * math.pi * frequency * (i / framerate)))
                data = struct.pack('<h', value)
                f.writeframesraw(data)

    return path