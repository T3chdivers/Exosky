import numpy as np

class StarsService:
    @staticmethod
    def kelvin_to_rgb(temp_kelvin):
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