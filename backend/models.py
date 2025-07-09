from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from backend.database import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    theme = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    contents = relationship("Content", back_populates="account")


class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    caption = Column(Text)
    hashtags = Column(Text)
    image_url = Column(String)
    video_url = Column(String)
    scheduled_time = Column(DateTime, nullable=True)
    posted = Column(Boolean, default=False)

    account = relationship("Account", back_populates="contents")