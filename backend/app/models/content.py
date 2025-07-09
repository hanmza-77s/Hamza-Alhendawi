from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.id"))
    content_type = Column(String)  # "image", "video", "carousel"
    caption = Column(Text)
    hashtags = Column(Text)  # JSON array
    media_path = Column(String)  # Path to generated media
    ai_generated = Column(Boolean, default=True)
    status = Column(String)  # "draft", "scheduled", "published", "failed"
    engagement_metrics = Column(JSON)  # Likes, comments, shares
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    account = relationship("SocialAccount", back_populates="contents")
    schedules = relationship("ContentSchedule", back_populates="content")

class ContentSchedule(Base):
    __tablename__ = "content_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("contents.id"))
    scheduled_time = Column(DateTime(timezone=True))
    published_time = Column(DateTime(timezone=True))
    status = Column(String)  # "pending", "published", "failed"
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    content = relationship("Content", back_populates="schedules")