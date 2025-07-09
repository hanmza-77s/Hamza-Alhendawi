import os, time, wave, logging, contextlib

log = logging.getLogger(__name__)
MEDIA_DIR = "media"


def generate_music(theme: str, duration: int = 5) -> str:
    """Generate (mock) music file and return local path."""
    os.makedirs(MEDIA_DIR, exist_ok=True)
    filename = f"music_{int(time.time())}.wav"
    path = os.path.join(MEDIA_DIR, filename)

    # Create silent wav if not exists
    framerate = 44100
    nframes = duration * framerate
    comptype = "NONE"
    compname = "not compressed"
    nchannels = 1
    sampwidth = 2  # bytes

    with contextlib.closing(wave.open(path, 'w')) as f:
        f.setparams((nchannels, sampwidth, framerate, nframes, comptype, compname))
        silence = (b'\x00\x00' * nframes)
        f.writeframes(silence)

    return path