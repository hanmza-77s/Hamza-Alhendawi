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


class ContentGenerateRequest(BaseModel):
    account_id: int


class ContentUpdate(BaseModel):
    scheduled_time: Optional[datetime] = None
    posted: Optional[bool] = None


class CommentOut(BaseModel):
    id: int
    text: str
    sentiment: str
    reply: str | None = None

    class Config:
        orm_mode = True


class AnalyticsOut(BaseModel):
    total: int
    posted: int
    scheduled: int
    dates: list[str]
    posted_counts: list[int]
    scheduled_counts: list[int]
    comments_total: int
    positive_comments: int
    neutral_comments: int
    negative_comments: int