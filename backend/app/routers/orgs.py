from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..auth import require_role
from pydantic import BaseModel


router = APIRouter(prefix="/orgs", tags=["orgs"])

@router.post("", response_model=schemas.OrgOut, dependencies=[Depends(require_role(["manager"]))])
def create_org(payload: schemas.OrgCreateIn, db: Session = Depends(get_db)):
    if db.get(models.Organization, payload.id):
        raise HTTPException(400, "org already exists")
    org = models.Organization(id=payload.id, name=payload.name, seats_purchased=payload.seats_purchased)
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

@router.get("/{org_id}", response_model=schemas.OrgOut, dependencies=[Depends(require_role(["manager"]))])
def get_org(org_id: str, db: Session = Depends(get_db)):
    org = db.get(models.Organization, org_id)
    if not org:
        raise HTTPException(404, "org not found")
    return org

from pydantic import BaseModel

class SeatsUpdate(BaseModel):
    seats_purchased: int

@router.patch("/{org_id}/seats", response_model=schemas.OrgOut, dependencies=[Depends(require_role(["manager"]))])
def update_seats(org_id: str, payload: SeatsUpdate, db: Session = Depends(get_db)):
    org = db.get(models.Organization, org_id)
    if not org:
        raise HTTPException(404, "org not found")
    if payload.seats_purchased < 0:
        raise HTTPException(400, "seats must be >= 0")
    org.seats_purchased = payload.seats_purchased
    db.commit()
    db.refresh(org)
    return org
