from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models, schemas
from ..auth import require_role

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
