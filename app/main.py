from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import Base, engine
from app.models import Brand, OfficialApp, SocialAccount
from app.routers import brands, official_apps, social_accounts

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BrandGuard API",
    description="Digital Risk Protection Platform for Social Media and App Store Monitoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(brands.router)
app.include_router(social_accounts.router)
app.include_router(official_apps.router)


@app.get("/")
def root():
    return {
        "application": "BrandGuard",
        "message": "Digital Risk Protection API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError:
        return {
            "status": "unhealthy",
            "database": "disconnected",
        }

    return {"status": "healthy", "database": "connected"}
