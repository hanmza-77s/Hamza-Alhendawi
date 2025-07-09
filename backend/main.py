from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.routers import account  # Future: content, scheduler, analytics

# Create SQLite tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AutoSocial API")

# Allow local dev frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(account.router, prefix="/api")


@app.get("/health")
def health_check():
    return {"status": "ok"}