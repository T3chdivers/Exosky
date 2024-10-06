from astroquery.gaia import Gaia
from fastapi import FastAPI
from src.routers.exoplanets import exoplanets_router
from src.routers.stars import stars_router
from fastapi.middleware.cors import CORSMiddleware

Gaia.ROW_LIMIT = 100000
app = FastAPI(title="Techdivers - Exosky",
              description="API for Techdivers Exosky"
              )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exoplanets_router)
app.include_router(stars_router)