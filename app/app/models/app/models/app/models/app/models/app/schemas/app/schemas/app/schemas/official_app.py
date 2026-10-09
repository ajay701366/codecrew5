from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OfficialAppCreate(BaseModel):
    name: str
    platform: str
    developer: str
    package_name: str | None = None
    description: str | None = None
    icon_url: str | None = None


class OfficialAppResponse(BaseModel):
    id: int
    brand_id: int
    name: str
    platform: str
    developer: str
    package_name: str | None
    description: str | None
    icon_url: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)