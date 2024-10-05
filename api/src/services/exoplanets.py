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
        for row in sorted_df.iterrows():
            output.append(ExoplanetElement(
                planet_id=str(row["pl_name"]),
                ra=row["ra"],
                dec=row["dec"],
                distance=row["sy_dist"]
            ))

        return output

    @staticmethod
    def get_exoplanet_data(exoplanet_name: str):
        file_path = os.path.join(f"{os.getcwd()}", "data", "planets.csv")
        df = pd.read_csv(file_path)
        single_row = df[df['pl_name'] == exoplanet_name]
        single_row = single_row[['pl_name', 'hostname', 'disc_facility', 'disc_telescope']]