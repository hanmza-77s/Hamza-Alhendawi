from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend import models, schemas
from backend.services import ai, scheduler

router = APIRouter(prefix="/account", tags=["Account"])


@router.post("/", response_model=schemas.AccountOut)
def create_account(payload: schemas.AccountCreate, db: Session = Depends(get_db)):
    if db.query(models.Account).filter_by(username=payload.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    account = models.Account(**payload.dict())
    db.add(account)
    db.commit()
    db.refresh(account)

    # Generate initial strategy as a content item
    strategy_text = ai.generate_strategy(payload.theme)
    strategy_content = models.Content(
        account_id=account.id,
        caption=strategy_text,
        hashtags="",
    )
    db.add(strategy_content)

    # Prepare a few starter posts
    generated = []
    for _ in range(3):
        post_data = ai.generate_post(payload.theme)
        c = models.Content(account_id=account.id, **post_data)
        db.add(c)
        generated.append(c)

    db.commit()
    scheduler.schedule_contents(db, generated)

    return account


@router.get("/", response_model=List[schemas.AccountOut])
def list_accounts(db: Session = Depends(get_db)):
    return db.query(models.Account).all()