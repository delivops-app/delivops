from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Enum, func
from sqlalchemy.orm import relationship
from .db import Base
import enum

class DriverStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    disabled = "disabled"
    archived = "archived"

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True)  # UUID string
    name = Column(String, nullable=False)
    seats_purchased = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    drivers = relationship("Driver", back_populates="org")

class Driver(Base):
    __tablename__ = "drivers"
    driver_id = Column(String, primary_key=True)  # UUID string
    org_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    auth0_user_id = Column(String, unique=True, nullable=False)
    email = Column(String, nullable=False)
    status = Column(Enum(DriverStatus), default=DriverStatus.pending, nullable=False)
    deactivated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    org = relationship("Organization", back_populates="drivers")
