from fastapi import APIRouter
from backend.services import config

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("")
async def get_settings():
    return config.load_config()


@router.post("")
async def save_settings(data: dict):
    cfg = config.load_config()
    cfg.update(data)
    config.save_config(cfg)
    return {"status": "saved"}