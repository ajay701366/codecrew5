from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandResponse


router = APIRouter(
    prefix="/api/brands",
    tags=["Brands"]
)


@router.post(
    "",
    response_model=BrandResponse,
    status_code=status.HTTP_201_CREATED
)
def create_brand(
    brand_data: BrandCreate,
    db: Session = Depends(get_db)
):
    existing_brand = (
        db.query(Brand)
        .filter(Brand.name.ilike(brand_data.name))
        .first()
    )

    if existing_brand:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Brand already exists"
        )

    brand = Brand(
        name=brand_data.name.strip(),
        website=brand_data.website,
        description=brand_data.description,
        logo_url=brand_data.logo_url
    )

    db.add(brand)
    db.commit()
    db.refresh(brand)

    return brand


@router.get(
    "",
    response_model=list[BrandResponse]
)
def get_all_brands(
    db: Session = Depends(get_db)
):
    return (
        db.query(Brand)
        .order_by(Brand.id.desc())
        .all()
    )


@router.get(
    "/{brand_id}",
    response_model=BrandResponse
)
def get_brand(
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

    return brand


@router.delete(
    "/{brand_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_brand(
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

    db.delete(brand)
    db.commit()

    return None