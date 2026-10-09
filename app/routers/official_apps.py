from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.brand import Brand
from app.models.official_app import OfficialApp
from app.schemas.official_app import OfficialAppCreate, OfficialAppResponse


router = APIRouter(prefix="/api/brands", tags=["Official Apps"])


@router.post(
    "/{brand_id}/apps",
    response_model=OfficialAppResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_official_app(
    brand_id: int,
    app_data: OfficialAppCreate,
    db: Session = Depends(get_db),
):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if brand is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")

    official_app = OfficialApp(
        brand_id=brand_id,
        name=app_data.name.strip(),
        platform=app_data.platform.strip().lower(),
        developer=app_data.developer.strip(),
        package_name=app_data.package_name,
        description=app_data.description,
        icon_url=app_data.icon_url,
    )

    db.add(official_app)
    db.commit()
    db.refresh(official_app)
    return official_app


@router.get("/{brand_id}/apps", response_model=list[OfficialAppResponse])
def get_official_apps(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if brand is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Brand not found")

    return (
        db.query(OfficialApp)
        .filter(OfficialApp.brand_id == brand_id)
        .order_by(OfficialApp.id.desc())
        .all()
    )


@router.delete("/apps/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_official_app(app_id: int, db: Session = Depends(get_db)):
    official_app = db.query(OfficialApp).filter(OfficialApp.id == app_id).first()
    if official_app is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Official app not found")

    db.delete(official_app)
    db.commit()
    return None
