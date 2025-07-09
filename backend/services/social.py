import logging, random, time
from backend.models import Account, Content

log = logging.getLogger(__name__)


def _sleep_human(min_sec: float = 1, max_sec: float = 3):
    time.sleep(random.uniform(min_sec, max_sec))


def publish(account: Account, content: Content) -> bool:
    """Pretend to open a browser & post; returns success."""
    log.info("[Publish] %s -> %s", account.username, content.caption[:30])
    _sleep_human()
    # Here we would launch Playwright, rotate proxies, random scroll, etc.
    return True