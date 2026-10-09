from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Import models so SQLAlchemy knows about all tables
from app.models import Brand, SocialAccount, OfficialApp

from app.routers import (
    brands,
    social_accounts,
    official_apps,
)


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="BrandGuard API",
    description=(
        "Digital Risk Protection Platform for "
        "Social Media and App Store Monitoring"
    ),
    version="1.0.0",
)


# Frontend will connect from these origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
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
    return {
        "status": "healthy",
        "database": "connected",
    }