from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SocialAccountCreate(BaseModel):
    platform: str
    username: str
    url: str | None = None


class SocialAccountResponse(BaseModel):
    id: int
    brand_id: int
    platform: str
    username: str
    url: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)