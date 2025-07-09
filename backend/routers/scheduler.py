from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.services import scheduler

router = APIRouter(prefix="/scheduler", tags=["Scheduler"])


@router.post("/run")
def run_scheduler(db: Session = Depends(get_db)):
    scheduler.run_pending(db)
    return {"status": "ok"}