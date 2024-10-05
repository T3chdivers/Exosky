import math
import os

import pandas as pd

from src.models.exoplanet_element import ExoplanetElement


class ExoplanetsService:
    @staticmethod
    def get_exoplanets():
        file_path = os.path.join(f"{os.getcwd()}", "data", "planets.csv")
        df = pd.read_csv(file_path)
        selected_columns = ["pl_name", "rastr", "decstr", "sy_dist"]
        filtered_df = df[selected_columns]
        filtered_df = filtered_df[~filtered_df["sy_dist"].isnull()]
        sorted_df = filtered_df.sort_values("sy_dist")

        output = []
        for row in sorted_df.itertuples():
            distance = (1000 / float(row[4])) * 3.26156
            ra = (15 * int(row[2][:2]) + int(row[2][3:5]) / 4 + float(row[2][6:10]) / 240) * (math.pi / 180)
            desc = (15 * int(row[3][:3]) + int(row[3][4:6]) / 4 + float(row[3][7:9]) / 240) * (math.pi / 180)

            output.append(ExoplanetElement(
                planet_id=str(row[1]),
                x=distance * math.cos(desc) * math.cos(ra),
                y=distance * math.cos(desc) * math.sin(ra),
                z=distance * math.sin(desc),
                distance=float(row[4]) * 3.26156
            ))

        return output
