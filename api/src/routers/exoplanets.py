from typing import List

from fastapi import APIRouter

from src.services.exoplanets import ExoplanetsService

exoplanets_router = APIRouter(prefix="/exoplanets", tags=["exoplanets"])

@exoplanets_router.get("/")
async def get_exoplanets():
    return ExoplanetsService.get_exoplanets()