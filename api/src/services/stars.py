import math

import numpy as np
from astropy import units as u
from astropy.coordinates import SkyCoord, CartesianRepresentation, Distance
from astroquery.gaia import Gaia


class StarsService:
    @staticmethod
    def kelvin_to_rgb(temp_kelvin):
        if math.isnan(temp_kelvin):
            return 255, 255, 255

        # Ensure the temperature is within the typical range for visible spectrum
        temp_kelvin = max(1000, min(temp_kelvin, 40000)) / 100

        # Calculate red
        if temp_kelvin <= 66:
            red = 255
        else:
            red = 329.698727446 * ((temp_kelvin - 60) ** -0.1332047592)
            red = max(0, min(255, red))

        # Calculate green
        if temp_kelvin <= 66:
            green = 99.4708025861 * np.log(temp_kelvin) - 161.1195681661
            green = max(0, min(255, green))
        else:
            green = 288.1221695283 * ((temp_kelvin - 60) ** -0.0755148492)
            green = max(0, min(255, green))

        # Calculate blue
        if temp_kelvin >= 66:
            blue = 255
        else:
            if temp_kelvin <= 19:
                blue = 0
            else:
                blue = 138.5177312231 * np.log(temp_kelvin - 10) - 305.0447927307
                blue = max(0, min(255, blue))

        return int(red), int(green), int(blue)

    @staticmethod
    def rgb_to_hex(rgb):
        return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2])

    @staticmethod
    def kelvin_to_hex(temp_kelvin):
        rgb = StarsService.kelvin_to_rgb(temp_kelvin)
        return StarsService.rgb_to_hex(rgb)

    @staticmethod
    def get_stars(x: int | float, y: int | float, z: int | float, max_star_nb: int,
                  search_distance: int | float = 1000):
        cartesian_rep = CartesianRepresentation(
            [x, y, z] * u.pc
        )

        target_coord = SkyCoord(cartesian_rep, frame='icrs')

        target_ra = target_coord.ra.deg  # Right Ascension in degrees
        target_dec = target_coord.dec.deg  # Declination in degrees
        target_distance = target_coord.distance.pc  # Distance in parsecs

        search_distance = min(search_distance, target_distance)
        search_radius = np.arcsin(
            search_distance / np.sqrt((target_distance - search_distance) ** 2 + search_distance ** 2)) * 180 / np.pi

        max_mag = 10

        query = f"""
        SELECT TOP {max_star_nb}
          source_id, ra, dec, parallax, pmra, pmdec, phot_g_mean_mag, teff_gspphot
        FROM gaiadr3.gaia_source
        WHERE
          parallax IS NOT NULL
          AND ABS(1000/parallax - {target_distance}) < {search_distance}
          AND 
          1=CONTAINS(
            POINT('ICRS',ra,dec),
            CIRCLE('ICRS',{target_ra},{target_dec},{search_radius})
          )
          AND phot_g_mean_mag <= {max_mag}
          ORDER BY distance_gspphot DESC
        """

        job = Gaia.launch_job_async(query)
        raw_data = job.get_results()

        # count the number of stars
        print(len(raw_data))

        raw_data.info()
        data_df = raw_data.to_pandas()  # convert the data to a pandas dataframe
        data_df["dist_earth"] = data_df.apply(lambda row: 1000 / row["parallax"],
                                              axis=1)  # calculate the distance from the parallax

        target_coord = SkyCoord(ra=target_ra * u.deg, dec=target_dec * u.deg, distance=target_distance * u.pc,
                                frame='icrs')
        target_x, target_y, target_z = target_coord.cartesian.xyz.value

        # calculate the cartesian coordinates with the target planet as the origin
        star_spheric = SkyCoord(
            ra=data_df["ra"].values * u.deg,
            dec=data_df["dec"].values * u.deg,
            distance=data_df["dist_earth"].values * u.pc,
            frame='icrs'
        )

        data_df["x"] = star_spheric.cartesian.x.value
        data_df["y"] = star_spheric.cartesian.y.value
        data_df["z"] = star_spheric.cartesian.z.value

        # calculate the spherical coordinates with the target planet as the origin
        star_cartesian = SkyCoord(
            x=data_df["x"].values - target_x,
            y=data_df["y"].values - target_y,
            z=data_df["z"].values - target_z,
            unit='pc',
            representation_type='cartesian'
        )
        data_df["ra_star"] = star_cartesian.spherical.lon.value
        data_df["dec_star"] = star_cartesian.spherical.lat.value
        data_df["dist_star"] = star_cartesian.spherical.distance.value

        data_df = data_df.query(f"dist_star < {search_distance}")  # filter out stars that are too far away

        distance = Distance(parallax=data_df['parallax'].values * u.mas)

        # Add the absolute magnitude to the dataframe
        data_df['absolute_magnitude'] = data_df['phot_g_mean_mag'] - 5 * np.log10(distance.pc) + 5

        data_df['relative_magnitude'] = data_df['absolute_magnitude'] + 5 * np.log10(data_df['dist_star']) - 5

        res = []

        for _, row in data_df.iterrows():
            res.append({"ra": row["ra_star"], "dec": row["dec_star"], "dist": row["dist_star"],
                        "color": StarsService.adjust_color_brightness(StarsService.kelvin_to_hex(row["teff_gspphot"])),
                        "mag": row["relative_magnitude"]})
        return res
