from dataclasses import dataclass


@dataclass
class ExoplanetElement:
    planet_id: str
    ra: float
    dec: float
    distance: float