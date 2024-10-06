from dataclasses import dataclass


@dataclass
class ExoplanetElement:
    planet_id: str
    x: float
    y: float
    z: float
    distance: float