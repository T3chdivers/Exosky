from typing import List

from fastapi import APIRouter, HTTPException

from src.services.exoplanets import ExoplanetsService

from src.models.exoplanet_element import ExoplanetElement

exoplanets_router = APIRouter(prefix="/exoplanets", tags=["exoplanets"])


@exoplanets_router.get("/")
async def get_exoplanets() -> List[ExoplanetElement]:
    return ExoplanetsService.get_exoplanets()


@exoplanets_router.get("/name")
async def get_exoplanets(exoplanet_name: str):
    exo_details = ExoplanetsService.get_exoplanet_data(exoplanet_name)

    if exo_details is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return exo_details

@exoplanets_router.get("/search")
async def search_exoplanets(search_string: str):
    return ExoplanetsService.search_exoplanets(search_string)