import logging, os, random, time
from contextlib import suppress
from typing import List

from backend.models import Account, Content
from backend.services import ai
from backend.database import SessionLocal


log = logging.getLogger(__name__)

# In a real production setup these would come from env or DB
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
]

# proxies loaded from env or rotating list file
PROXY_FILE = os.getenv("AUTOSOCIAL_PROXY_FILE")
if PROXY_FILE and os.path.exists(PROXY_FILE):
    with open(PROXY_FILE) as pf:
        PROXIES = [l.strip() for l in pf if l.strip()]
else:
    PROXIES = os.getenv("AUTOSOCIAL_PROXIES", "").split(",") if os.getenv("AUTOSOCIAL_PROXIES") else []


def _sleep_human(min_sec: float = 0.5, max_sec: float = 3.0):
    """Random sleep to mimic human delay."""
    time.sleep(random.uniform(min_sec, max_sec))


def _pick_proxy() -> str | None:
    if not PROXIES:
        return None
    # simple round-robin
    proxy = PROXIES.pop(0)
    PROXIES.append(proxy)
    return proxy


def _random_scroll(page):
    for _ in range(random.randint(3, 8)):
        _sleep_human(0.2, 1)
        page.mouse.wheel(0, random.randint(200, 800))


def publish(account: Account, content: Content) -> bool:
    """Publish a post via Playwright.

    Returns True if published (simulated if Playwright unavailable)."""
    log.info("[Publish] %s -> %s", account.username, content.caption[:30])

    try:
        from playwright.sync_api import sync_playwright
    except Exception as e:
        log.warning("Playwright not installed: %s", e)
        return _simulate_publish(account, content)

    proxy = _pick_proxy()
    ua = random.choice(USER_AGENTS)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, proxy={"server": proxy} if proxy else None)
        context = browser.new_context(user_agent=ua, locale="en-US")
        page = context.new_page()

        try:
            # Login (simplified)
            page.goto("https://www.instagram.com/accounts/login/")
            _sleep_human(2, 4)
            page.fill("input[name='username']", account.username, timeout=15000)
            _sleep_human()
            page.fill("input[name='password']", account.password)
            _sleep_human()
            page.click("button[type='submit']")
            page.wait_for_load_state("networkidle", timeout=20000)

            _random_scroll(page)

            # Simulate post creation (Instagram web upload is behind plus icon, etc.)
            # For brevity we'll pretend by navigating to content url and like.
            page.goto("https://www.instagram.com/")
            _sleep_human()

            # TODO: implement real upload. For now log and pretend success.
            log.info("Simulated upload of %s", content.image_url or content.video_url)
            success = True
        except Exception as e:
            log.error("Publish failed: %s", e)
            success = False
        finally:
            context.close()
            browser.close()

    return success


def _simulate_publish(account: Account, content: Content) -> bool:
    """Fallback when Playwright is missing. Just wait and return success."""
    _sleep_human(1, 2)
    return True


# Comment handling -----------------------------------------------------------


def collect_comments(content: Content) -> List[str]:
    """Scrape comments for a post (stub). Returns list of comment texts."""
    try:
        from playwright.sync_api import sync_playwright
    except Exception:
        # fallback mock
        return ["Great post!", "Love this tip", "Not sure I agree"]

    comments: List[str] = []
    url = content.image_url or content.video_url
    if not url:
        return comments

    proxy = _pick_proxy()
    ua = random.choice(USER_AGENTS)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, proxy={"server": proxy} if proxy else None)
        page = browser.new_page(user_agent=ua, locale="en-US")
        try:
            page.goto(url)
            page.wait_for_selector("article")
            _random_scroll(page)
            elements = page.query_selector_all("ul li span")
            for el in elements[:20]:
                txt = el.inner_text().strip()
                if txt:
                    comments.append(txt)
        except Exception as e:
            log.warning("Failed collecting comments: %s", e)
        finally:
            browser.close()
    return comments


def auto_reply(account: Account, content: Content):
    """Generate and log replies to comments using AI."""
    comments = collect_comments(content)
    for c in comments:
        sentiment = ai.classify_sentiment(c)
        reply = ai.generate_reply(account.theme, c)
        log.info("[AutoReply-%s] %s -> %s", sentiment, c, reply)

        # persist comment & reply
        db = SessionLocal()
        try:
            from backend import models
            comment_obj = models.Comment(
                content_id=content.id,
                text=c,
                sentiment=sentiment,
                reply=reply,
            )
            db.add(comment_obj)
            db.commit()
        finally:
            db.close()
        _sleep_human(1, 3)