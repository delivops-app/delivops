from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from . import models
from .routers import orgs, drivers

# Crée les tables si inexistantes (MVP simple ; plus tard: Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Delivops API (MVP)")

# Autoriser le front Vite en dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orgs.router)
app.include_router(drivers.router)

@app.get("/health")
def health():
    return {"status": "ok"}
