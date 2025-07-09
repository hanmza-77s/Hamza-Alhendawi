from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

# Import database and models
from app.database.database import create_tables

# Import API routers
from app.api import accounts, content, scheduler, engagement


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    create_tables()
    print("🚀 Database tables created successfully")
    yield
    # Shutdown: Add any cleanup logic here
    print("👋 Application shutting down")


# Create FastAPI application
app = FastAPI(
    title="AutoSocial API",
    description="AI-Powered Social Media Automation Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(accounts.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(scheduler.router, prefix="/api")
app.include_router(engagement.router, prefix="/api")


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to AutoSocial API",
        "version": "1.0.0",
        "description": "AI-Powered Social Media Automation Platform",
        "docs": "/docs",
        "status": "running"
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "autosocial-api",
        "version": "1.0.0"
    }


# AI status check
@app.get("/api/ai-status")
async def ai_status():
    """Check AI services availability"""
    import os
    
    openai_key = os.getenv("OPENAI_API_KEY")
    
    return {
        "openai_configured": bool(openai_key),
        "services": {
            "content_generation": True,
            "image_generation": bool(openai_key),
            "sentiment_analysis": True,
            "video_generation": True,  # Mock service
            "music_generation": True   # Mock service
        }
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "type": "server_error"
        }
    )


# Not found handler
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not found",
            "message": "The requested resource was not found",
            "type": "not_found"
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )