from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class SocialAccount(Base):
    __tablename__ = "social_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)  # This should be encrypted in production
    platform = Column(String)  # "instagram" or "tiktok"
    theme = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    content_strategy = relationship("ContentStrategy", back_populates="account", uselist=False)
    content_posts = relationship("ContentPost", back_populates="account")
    comments = relationship("Comment", back_populates="account")

class ContentStrategy(Base):
    __tablename__ = "content_strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.id"))
    theme = Column(String)
    strategy_data = Column(JSON)  # Store the AI-generated strategy
    content_pillars = Column(JSON)  # Main content themes
    posting_schedule = Column(JSON)  # When to post
    hashtag_groups = Column(JSON)  # Organized hashtag collections
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    account = relationship("SocialAccount", back_populates="content_strategy")

class ContentPost(Base):
    __tablename__ = "content_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.id"))
    title = Column(String)
    caption = Column(Text)
    hashtags = Column(String)
    content_type = Column(String)  # "image", "video", "carousel"
    media_urls = Column(JSON)  # List of media file URLs
    music_url = Column(String, nullable=True)
    scheduled_time = Column(DateTime(timezone=True))
    posted_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="draft")  # "draft", "scheduled", "posted", "failed"
    engagement_stats = Column(JSON)  # likes, comments, shares, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    account = relationship("SocialAccount", back_populates="content_posts")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.id"))
    post_id = Column(String)  # External post ID from platform
    commenter_username = Column(String)
    comment_text = Column(Text)
    sentiment = Column(String)  # "positive", "negative", "neutral"
    replied = Column(Boolean, default=False)
    reply_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    account = relationship("SocialAccount", back_populates="comments")

class ScheduledTask(Base):
    __tablename__ = "scheduled_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.id"))
    task_type = Column(String)  # "post", "engage", "analyze"
    task_data = Column(JSON)
    scheduled_time = Column(DateTime(timezone=True))
    status = Column(String, default="pending")  # "pending", "running", "completed", "failed"
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("social_accounts.id"))
    date = Column(DateTime(timezone=True))
    followers_count = Column(Integer)
    following_count = Column(Integer)
    posts_count = Column(Integer)
    engagement_rate = Column(String)
    reach = Column(Integer, nullable=True)
    impressions = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())