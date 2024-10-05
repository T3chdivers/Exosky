from fastapi import FastAPI
from src.routers.exoplanets import exoplanets_router
app = FastAPI(title="Techdivers - Exosky",
              description="API for Techdivers Exosky"
              )

app.include_router(exoplanets_router)