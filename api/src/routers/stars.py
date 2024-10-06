from fastapi import APIRouter

from src.services.stars import StarsService

stars_router = APIRouter(prefix="/stars", tags=["stars"])


@stars_router.get("/")
async def get_stars_from_exoplanet(x: int | float, y: int | float, z: int | float, max_star_nb: int, search_distance: int | float = 200):
    return StarsService.get_stars(x, y, z, max_star_nb, search_distance)
