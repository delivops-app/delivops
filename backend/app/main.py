from fastapi import FastAPI
from .db import Base, engine
from . import models
from .routers import orgs, drivers

# Crée les tables si inexistantes (MVP simple ; plus tard: Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Delivops API (MVP)")

app.include_router(orgs.router)
app.include_router(drivers.router)

@app.get("/health")
def health():
    return {"status": "ok"}
