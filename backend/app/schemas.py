from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

class DriverStatus(str, Enum):
    pending = "pending"
    active = "active"
    disabled = "disabled"
    archived = "archived"

class InviteDriverIn(BaseModel):
    org_id: str
    email: EmailStr

class DriverOut(BaseModel):
    driver_id: str
    org_id: str
    email: EmailStr
    status: DriverStatus
    class Config:
        from_attributes = True

class OrgCreateIn(BaseModel):
    id: str
    name: str
    seats_purchased: int

class OrgOut(BaseModel):
    id: str
    name: str
    seats_purchased: int
