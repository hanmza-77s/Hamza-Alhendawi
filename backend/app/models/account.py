from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class SocialAccount(Base):
    __tablename__ = "social_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String)  # "instagram" or "tiktok"
    username = Column(String)
    password = Column(String)  # Encrypted
    theme = Column(String)  # e.g., "boxing", "health", "motivation"
    is_active = Column(Boolean, default=True)
    auto_posting = Column(Boolean, default=True)
    proxy_enabled = Column(Boolean, default=False)
    proxy_settings = Column(Text)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="accounts")
    contents = relationship("Content", back_populates="account")