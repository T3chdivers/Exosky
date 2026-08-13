from astroquery.gaia import Gaia
from fastapi import FastAPI
from src.routers.exoplanets import exoplanets_router
from src.routers.stars import stars_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

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
# star field responses can be several MB of JSON; compress them in transit
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(exoplanets_router)
app.include_router(stars_router)