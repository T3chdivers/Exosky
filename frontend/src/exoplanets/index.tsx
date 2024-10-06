import {useEffect, useState} from "react"
import {Canvas} from "@react-three/fiber"
import styles from "././index.module.css"
import axios from "axios"
import {Earth} from "./Earth"
import {SelectionMenu} from "./SelectionMenu"
import {Exoplanet} from "./Exoplanet"
import {ExoplanetCard} from "./ExoplanetCard.tsx";

export type ExoplanetDTO = {
  planet_id: string;
  x: number;
  y: number;
  z: number;
  distance: number;
}

export function Exoplanets() {
  const [exoplanets, setExoplanets] = useState<ExoplanetDTO[] | undefined>();
  const [selectedExoplanet, setSelectedExoplanet] = useState<ExoplanetDTO | null>(null);

  useEffect(() => {
    if (localStorage.getItem("exoplanets")) {
      setExoplanets(JSON.parse(localStorage.getItem("exoplanets") as string));
      return;
    }

    axios.get("https://exosky-api.dixen.fr/exoplanets/").then((response: any) => {
      setExoplanets(response.data as ExoplanetDTO[]);

      localStorage.setItem("exoplanets", JSON.stringify(response.data));
    });
  }, []);

  function clickHandler(exoplanet: ExoplanetDTO) {
    setSelectedExoplanet(exoplanet);
  }

  return (
    <div id="canvas-container" className={styles.canvasContainer}>
      <Canvas camera={{far: 5000, position: [6, 5, -2]}} className={styles.canvas}>
        <Earth/>
        {!!exoplanets?.length && exoplanets.map((exoplanet: ExoplanetDTO) => <Exoplanet exoplanet={exoplanet}/>)}
        <ambientLight intensity={0.1}/>
      </Canvas>
      <SelectionMenu clickHandler={clickHandler} exoplanets={exoplanets}/>
      { selectedExoplanet && <ExoplanetCard exoplanet={selectedExoplanet}></ExoplanetCard> }
    </div>
  );
}
