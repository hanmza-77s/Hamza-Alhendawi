import json, os, logging
from typing import Any, Dict

log = logging.getLogger(__name__)
CONFIG_PATH = "config.json"
DEFAULT_CONFIG = {
    "openai_api_key": os.getenv("OPENAI_API_KEY", ""),
    "proxies": os.getenv("AUTOSOCIAL_PROXIES", ""),
    "headless": True,
}


def load_config() -> Dict[str, Any]:
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
        except Exception as e:
            log.error("Failed reading config: %s", e)
    return DEFAULT_CONFIG.copy()


def save_config(cfg: Dict[str, Any]):
    try:
        with open(CONFIG_PATH, "w") as f:
            json.dump(cfg, f, indent=2)
    except Exception as e:
        log.error("Failed saving config: %s", e)

    # Propagate to env vars for current process
    os.environ["OPENAI_API_KEY"] = cfg.get("openai_api_key", "")
    os.environ["AUTOSOCIAL_PROXIES"] = cfg.get("proxies", "")