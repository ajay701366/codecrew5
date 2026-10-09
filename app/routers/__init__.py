from app.routers.brands import router as brands_router
from app.routers.social_accounts import router as social_accounts_router
from app.routers.official_apps import router as official_apps_router

__all__ = [
    "brands_router",
    "social_accounts_router",
    "official_apps_router",
]
