from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.brand import Brand
from app.models.social_account import SocialAccount
from app.schemas.social_account import (
    SocialAccountCreate,
    SocialAccountResponse,
)


router = APIRouter(
    prefix="/api/brands",
    tags=["Official Social Accounts"]
)


@router.post(
    "/{brand_id}/social-accounts",
    response_model=SocialAccountResponse,
    status_code=status.HTTP_201_CREATED
)
def add_social_account(
    brand_id: int,
    account_data: SocialAccountCreate,
    db: Session = Depends(get_db)
):
    brand = (
        db.query(Brand)
        .filter(Brand.id == brand_id)
        .first()
    )

    if brand is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )

    account = SocialAccount(
        brand_id=brand_id,
        platform=account_data.platform.strip().lower(),
        username=account_data.username.strip(),
        url=account_data.url
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account


@router.get(
    "/{brand_id}/social-accounts",
    response_model=list[SocialAccountResponse]
)
def get_social_accounts(
    brand_id: int,
    db: Session = Depends(get_db)
):
    brand = (
        db.query(Brand)
        .filter(Brand.id == brand_id)
        .first()
    )

    if brand is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )

    return (
        db.query(SocialAccount)
        .filter(SocialAccount.brand_id == brand_id)
        .order_by(SocialAccount.id.desc())
        .all()
    )


@router.delete(
    "/social-accounts/{account_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_social_account(
    account_id: int,
    db: Session = Depends(get_db)
):
    account = (
        db.query(SocialAccount)
        .filter(SocialAccount.id == account_id)
        .first()
    )

    if account is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Social account not found"
        )

    db.delete(account)
    db.commit()

    return None