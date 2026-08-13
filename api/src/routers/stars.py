from fastapi import APIRouter
from starlette.concurrency import run_in_threadpool

from src.services.stars import StarsService

stars_router = APIRouter(prefix="/stars", tags=["stars"])


@stars_router.get("/")
async def get_stars_from_exoplanet(x: int | float, y: int | float, z: int | float, max_star_nb: int, search_distance: int | float = 200):
    # StarsService.get_stars blocks on network I/O (Gaia TAP query); run off the event loop
    # so it doesn't stall every other request while it's in flight.
    return await run_in_threadpool(StarsService.get_stars, x, y, z, max_star_nb, search_distance)
