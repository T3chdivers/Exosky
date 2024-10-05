import math
import os

import pandas as pd

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
            distance = (1000 / float(row[4])) * 3.26156

            output.append(ExoplanetElement(
                planet_id=str(row["pl_name"]),
                x=distance * math.cos(row["dec"]) * math.cos(row["ra"]),
                y=distance * math.cos(row["dec"]) * math.sin(row["ra"]),
                z=distance * math.sin(row["dec"]),
                distance=float(row["sy_dist"]) * 3.26156
            ))

        return output

    @staticmethod
    def get_exoplanet_data(exoplanet_name: str):
        file_path = os.path.join(f"{os.getcwd()}", "data", "planets.csv")
        df = pd.read_csv(file_path)
        single_row = df[df['pl_name'] == exoplanet_name]
        single_row = single_row[['pl_name', 'hostname', 'disc_facility', 'disc_telescope']]
