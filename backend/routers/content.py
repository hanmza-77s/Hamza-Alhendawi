from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os

from backend.database import get_db
from backend import models, schemas
from backend.services import ai, image_gen, music_gen, video_compose

router = APIRouter(prefix="/content", tags=["Content"])


@router.post("/generate", response_model=schemas.ContentOut)
def generate_content(payload: schemas.ContentGenerateRequest, db: Session = Depends(get_db)):
    account = db.query(models.Account).filter_by(id=payload.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    post_data = ai.generate_post(account.theme)
    caption = post_data["caption"]
    hashtags = post_data["hashtags"]

    # Generate media
    image_path = image_gen.generate_image(account.theme)
    music_path = music_gen.generate_music(account.theme)
    video_path = video_compose.compose_video(image_path, music_path, caption=caption)

    def to_url(path: str) -> str:
        return path if path.startswith("/media") else f"/{path}"

    content = models.Content(
        account_id=account.id,
        caption=caption,
        hashtags=hashtags,
        image_url=to_url(image_path),
        video_url=to_url(video_path),
    )
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


@router.get("/{account_id}", response_model=List[schemas.ContentOut])
def list_content(account_id: int, db: Session = Depends(get_db)):
    return db.query(models.Content).filter_by(account_id=account_id).all()


# Update single content (schedule time / posted flag)


@router.patch("/item/{content_id}", response_model=schemas.ContentOut)
def update_content(content_id: int, payload: schemas.ContentUpdate, db: Session = Depends(get_db)):
    content = db.query(models.Content).filter_by(id=content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")

    update_data = payload.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(content, k, v)
    db.commit()
    db.refresh(content)
    return content