from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BrandCreate(BaseModel):
    name: str
    website: str | None = None
    description: str | None = None
    logo_url: str | None = None


class BrandResponse(BaseModel):
    id: int
    name: str
    website: str | None
    description: str | None
    logo_url: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
