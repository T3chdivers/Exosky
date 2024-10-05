from typing import List

from fastapi import APIRouter

from src.services.exoplanets import ExoplanetsService

from src.models.exoplanet_element import ExoplanetElement

exoplanets_router = APIRouter(prefix="/exoplanets", tags=["exoplanets"])


@exoplanets_router.get("/")
async def get_exoplanets() -> List[ExoplanetElement]:
    return ExoplanetsService.get_exoplanets()
