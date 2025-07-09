from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.account_service import AccountService
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/accounts", tags=["accounts"])
account_service = AccountService()

class CreateAccountRequest(BaseModel):
    username: str
    password: str
    theme: str
    platform: str = "instagram"

class AccountResponse(BaseModel):
    id: int
    username: str
    platform: str
    theme: str
    is_active: bool

@router.post("/create")
async def create_account(
    request: CreateAccountRequest,
    db: Session = Depends(get_db)
):
    """Create a new social media account with AI strategy"""
    result = await account_service.create_account(
        db=db,
        username=request.username,
        password=request.password,
        theme=request.theme,
        platform=request.platform
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/")
async def get_accounts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all accounts"""
    accounts = account_service.get_accounts(db, skip=skip, limit=limit)
    return {
        "accounts": [
            {
                "id": account.id,
                "username": account.username,
                "platform": account.platform,
                "theme": account.theme,
                "is_active": account.is_active,
                "created_at": account.created_at.isoformat()
            }
            for account in accounts
        ]
    }

@router.get("/{account_id}")
async def get_account(
    account_id: int,
    db: Session = Depends(get_db)
):
    """Get account details by ID"""
    account = account_service.get_account(db, account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    strategy = account_service.get_account_strategy(db, account_id)
    
    return {
        "account": {
            "id": account.id,
            "username": account.username,
            "platform": account.platform,
            "theme": account.theme,
            "is_active": account.is_active,
            "created_at": account.created_at.isoformat()
        },
        "strategy": strategy.strategy_data if strategy else None
    }

@router.post("/{account_id}/login")
async def login_account(
    account_id: int,
    db: Session = Depends(get_db)
):
    """Login to social media platform"""
    result = await account_service.login_account(db, account_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.post("/{account_id}/regenerate-strategy")
async def regenerate_strategy(
    account_id: int,
    db: Session = Depends(get_db)
):
    """Regenerate content strategy for account"""
    result = await account_service.regenerate_strategy(db, account_id)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return result

@router.get("/{account_id}/strategy")
async def get_account_strategy(
    account_id: int,
    db: Session = Depends(get_db)
):
    """Get account content strategy"""
    strategy = account_service.get_account_strategy(db, account_id)
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    
    return {
        "strategy": strategy.strategy_data,
        "content_pillars": strategy.content_pillars,
        "posting_schedule": strategy.posting_schedule,
        "hashtag_groups": strategy.hashtag_groups,
        "created_at": strategy.created_at.isoformat()
    }