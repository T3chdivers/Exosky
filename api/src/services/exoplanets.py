import math
import os

import pandas as pd
from astropy.coordinates import SkyCoord
from astropy import units as u

from src.models.exoplanet_element import ExoplanetElement


class ExoplanetsService:
    @staticmethod
    def get_exoplanets():
        file_path = os.path.join(f"{os.getcwd()}", "data", "planets.csv")
        df = pd.read_csv(file_path)
        selected_columns = ["pl_name", "ra", "dec", "sy_dist"]
        filtered_df = df[selected_columns]
        filtered_df = filtered_df[~filtered_df["sy_dist"].isnull()]
        sorted_df = filtered_df.sort_values("sy_dist")

        output = []

        for _, row in sorted_df.iterrows():
            coords = SkyCoord(ra=row["ra"] * u.deg, dec=row["dec"] * u.deg, distance=row["sy_dist"] * u.pc,
                              frame='icrs')

            x, y, z = coords.cartesian.xyz.value

            output.append(ExoplanetElement(
                planet_id=str(row["pl_name"]),
                x=x,
                y=y,
                z=z,
                distance=row["sy_dist"]
            ))

        return output

    @staticmethod
    def get_exoplanet_data(exoplanet_name: str):
        file_path = os.path.join(f"{os.getcwd()}", "data", "planets.csv")
        df = pd.read_csv(file_path)
        single_row = df[df['pl_name'] == exoplanet_name]
        single_row = single_row[['pl_name', 'hostname', 'disc_facility', 'disc_telescope']]

        data = single_row.to_dict(orient='records')
        if len(data) == 0:
            return None
        return data[0]

    @staticmethod
    def search_exoplanets(search_string: str):
        file_path = os.path.join(f"{os.getcwd()}", "data", "planets.csv")
        df = pd.read_csv(file_path)
        selected_columns = ["pl_name", "ra", "dec", "sy_dist"]
        filtered_df = df[selected_columns]
        filtered_df = filtered_df[~filtered_df["sy_dist"].isnull()]
        sorted_df = filtered_df.sort_values("sy_dist")
        sorted_df = sorted_df[sorted_df['pl_name'].str.contains(search_string, na=False)]

        output = []
        for _, row in sorted_df.iterrows():
            distance = (1000 / float(row["sy_dist"])) * 3.26156

            output.append(ExoplanetElement(
                planet_id=str(row["pl_name"]),
                x=distance * math.cos(row["dec"]) * math.cos(row["ra"]),
                y=distance * math.cos(row["dec"]) * math.sin(row["ra"]),
                z=distance * math.sin(row["dec"]),
                distance=float(row["sy_dist"]) * 3.26156
            ))

        return output
