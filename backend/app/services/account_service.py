from sqlalchemy.orm import Session
from app.models.models import SocialAccount, ContentStrategy
from app.ai.openai_service import OpenAIService
from app.ai.mock_services import MockBrowserAutomation
from typing import Dict, Optional
import hashlib

class AccountService:
    def __init__(self):
        self.ai_service = OpenAIService()
        self.browser_service = MockBrowserAutomation()
    
    async def create_account(self, db: Session, username: str, password: str, theme: str, platform: str = "instagram") -> Dict:
        """Create a new social media account and generate AI strategy"""
        
        # Check if account already exists
        existing_account = db.query(SocialAccount).filter(SocialAccount.username == username).first()
        if existing_account:
            return {"success": False, "error": "Account already exists"}
        
        # Hash password (basic hashing - use proper encryption in production)
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Create account record
        account = SocialAccount(
            username=username,
            password=hashed_password,
            platform=platform,
            theme=theme
        )
        
        db.add(account)
        db.commit()
        db.refresh(account)
        
        # Generate AI content strategy
        try:
            strategy_data = await self.ai_service.generate_content_strategy(theme, platform)
            
            content_strategy = ContentStrategy(
                account_id=account.id,
                theme=theme,
                strategy_data=strategy_data,
                content_pillars=strategy_data.get("content_pillars", []),
                posting_schedule=strategy_data.get("posting_schedule", {}),
                hashtag_groups=strategy_data.get("hashtag_strategy", {})
            )
            
            db.add(content_strategy)
            db.commit()
            
            return {
                "success": True,
                "account_id": account.id,
                "strategy": strategy_data,
                "message": f"Account created successfully for {username}"
            }
            
        except Exception as e:
            # Rollback account creation if strategy generation fails
            db.delete(account)
            db.commit()
            return {"success": False, "error": f"Failed to generate content strategy: {str(e)}"}
    
    async def login_account(self, db: Session, account_id: int) -> Dict:
        """Login to the social media platform"""
        account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
        if not account:
            return {"success": False, "error": "Account not found"}
        
        # Attempt login using browser automation
        login_result = await self.browser_service.login_to_platform(
            account.username, 
            account.password,  # In production, decrypt this
            account.platform
        )
        
        if login_result["success"]:
            # Update account status
            account.is_active = True
            db.commit()
        
        return login_result
    
    def get_account(self, db: Session, account_id: int) -> Optional[SocialAccount]:
        """Get account by ID"""
        return db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
    
    def get_accounts(self, db: Session, skip: int = 0, limit: int = 100):
        """Get all accounts with pagination"""
        return db.query(SocialAccount).offset(skip).limit(limit).all()
    
    def get_account_strategy(self, db: Session, account_id: int) -> Optional[ContentStrategy]:
        """Get content strategy for account"""
        return db.query(ContentStrategy).filter(ContentStrategy.account_id == account_id).first()
    
    async def regenerate_strategy(self, db: Session, account_id: int) -> Dict:
        """Regenerate content strategy for an account"""
        account = self.get_account(db, account_id)
        if not account:
            return {"success": False, "error": "Account not found"}
        
        try:
            # Generate new strategy
            strategy_data = await self.ai_service.generate_content_strategy(account.theme, account.platform)
            
            # Update existing strategy or create new one
            strategy = db.query(ContentStrategy).filter(ContentStrategy.account_id == account_id).first()
            if strategy:
                strategy.strategy_data = strategy_data
                strategy.content_pillars = strategy_data.get("content_pillars", [])
                strategy.posting_schedule = strategy_data.get("posting_schedule", {})
                strategy.hashtag_groups = strategy_data.get("hashtag_strategy", {})
            else:
                strategy = ContentStrategy(
                    account_id=account_id,
                    theme=account.theme,
                    strategy_data=strategy_data,
                    content_pillars=strategy_data.get("content_pillars", []),
                    posting_schedule=strategy_data.get("posting_schedule", {}),
                    hashtag_groups=strategy_data.get("hashtag_strategy", {})
                )
                db.add(strategy)
            
            db.commit()
            
            return {
                "success": True,
                "strategy": strategy_data,
                "message": "Strategy regenerated successfully"
            }
            
        except Exception as e:
            return {"success": False, "error": f"Failed to regenerate strategy: {str(e)}"}