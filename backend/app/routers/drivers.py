import uuid, datetime as dt, os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from ..db import get_db
from .. import models, schemas
from ..auth import require_role
from ..auth0_mgmt import create_user, send_password_reset_email, set_user_blocked, update_app_metadata, assign_role

DISABLE_FREE_AFTER_DAYS = int(os.getenv("DISABLE_FREE_AFTER_DAYS", "30"))

router = APIRouter(prefix="/drivers", tags=["drivers"])

def _active_count(db: Session, org_id: str) -> int:
    return db.scalar(
        select(func.count(models.Driver.driver_id)).where(
            models.Driver.org_id==org_id,
            models.Driver.status==models.DriverStatus.active
        )
    ) or 0

@router.post("/invite", response_model=schemas.DriverOut, dependencies=[Depends(require_role(["manager"]))])
async def invite_driver(payload: schemas.InviteDriverIn, db: Session = Depends(get_db)):
    org = db.get(models.Organization, payload.org_id)
    if not org:
        raise HTTPException(404, "org not found")

    driver_id = str(uuid.uuid4())
    user = await create_user(email=payload.email, org_id=payload.org_id, driver_id=driver_id, blocked=True)

    await send_password_reset_email(payload.email)

    d = models.Driver(
        driver_id=driver_id,
        org_id=payload.org_id,
        auth0_user_id=user["user_id"],
        email=payload.email,
        status=models.DriverStatus.pending
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.post("/{driver_id}/activate", response_model=schemas.DriverOut, dependencies=[Depends(require_role(["manager"]))])
async def activate_driver(driver_id: str, db: Session = Depends(get_db)):
    d = db.get(models.Driver, driver_id)
    if not d: raise HTTPException(404, "driver not found")
    org = db.get(models.Organization, d.org_id)
    if not org: raise HTTPException(404, "org not found")

    if _active_count(db, d.org_id) >= org.seats_purchased:
        raise HTTPException(402, "no available seats — please purchase one")

    await set_user_blocked(d.auth0_user_id, False)
    await assign_role(d.auth0_user_id, "chauffeur")
    await update_app_metadata(d.auth0_user_id, {"org_id": d.org_id, "driver_id": d.driver_id, "status": "active"})

    d.status = models.DriverStatus.active
    d.deactivated_at = None
    db.commit()
    db.refresh(d)
    return d

@router.post("/{driver_id}/disable", response_model=schemas.DriverOut, dependencies=[Depends(require_role(["manager"]))])
async def disable_driver(driver_id: str, db: Session = Depends(get_db)):
    d = db.get(models.Driver, driver_id)
    if not d: raise HTTPException(404, "driver not found")

    await set_user_blocked(d.auth0_user_id, True)
    await update_app_metadata(d.auth0_user_id, {"status": "disabled"})

    d.status = models.DriverStatus.disabled
    d.deactivated_at = dt.datetime.utcnow()
    db.commit()
    db.refresh(d)
    return d

@router.post("/{driver_id}/reactivate", response_model=schemas.DriverOut, dependencies=[Depends(require_role(["manager"]))])
async def reactivate_driver(driver_id: str, db: Session = Depends(get_db)):
    d = db.get(models.Driver, driver_id)
    if not d: raise HTTPException(404, "driver not found")
    org = db.get(models.Organization, d.org_id)
    if _active_count(db, d.org_id) >= org.seats_purchased:
        raise HTTPException(402, "no available seats — please purchase one")

    await set_user_blocked(d.auth0_user_id, False)
    await update_app_metadata(d.auth0_user_id, {"status": "active"})

    d.status = models.DriverStatus.active
    d.deactivated_at = None
    db.commit()
    db.refresh(d)
    return d

@router.post("/{driver_id}/send-reset", dependencies=[Depends(require_role(["manager"]))])
async def send_reset(driver_id: str, db: Session = Depends(get_db)):
    d = db.get(models.Driver, driver_id)
    if not d: raise HTTPException(404, "driver not found")
    await send_password_reset_email(d.email)
    return {"ok": True}

@router.post("/free-seats-job", dependencies=[Depends(require_role(["manager"]))])
def free_seats_job(db: Session = Depends(get_db)):
    now = dt.datetime.utcnow()
    threshold = now - dt.timedelta(days=DISABLE_FREE_AFTER_DAYS)
    q = db.query(models.Driver).where(
        models.Driver.status==models.DriverStatus.disabled,
        models.Driver.deactivated_at != None,
        models.Driver.deactivated_at < threshold
    )
    count = 0
    for _ in q:
        count += 1
    return {"checked": count}
