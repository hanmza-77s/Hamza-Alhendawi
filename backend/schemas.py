from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AccountCreate(BaseModel):
    username: str
    password: str
    theme: str


class AccountOut(BaseModel):
    id: int
    username: str
    theme: str
    created_at: datetime

    class Config:
        orm_mode = True


class ContentOut(BaseModel):
    id: int
    caption: str
    hashtags: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    posted: bool

    class Config:
        orm_mode = True