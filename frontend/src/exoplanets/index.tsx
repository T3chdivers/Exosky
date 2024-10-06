import {useEffect, useRef, useState} from "react"
import {Canvas} from "@react-three/fiber"
import styles from "././index.module.css"
import axios from "axios"
import {Earth} from "./Earth"
import {SelectionMenu} from "./SelectionMenu"
import {Exoplanet} from "./Exoplanet"
import {ExoplanetCard} from "./ExoplanetCard.tsx";
import {useNavigate} from "react-router-dom";
import {CameraControls} from "@react-three/drei";

export type ExoplanetDTO = {
  planet_id: string;
  x: number;
  y: number;
  z: number;
  distance: number;
}

export function Exoplanets() {
  const [exoplanets, setExoplanets] = useState<ExoplanetDTO[] | undefined>();
  const [selectedExoplanet, setSelectedExoplanet] = useState<ExoplanetDTO | undefined>();

  const [animating, setAnimating] = useState<boolean | undefined>();
  const [animatingMenu, setAnimatingMenu] = useState<boolean | undefined>();

  const navigate = useNavigate();
  const cameraControlRef = useRef<CameraControls | null>(null);

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
    setAnimating(false);
    setSelectedExoplanet(exoplanet);
  }

  function onSkyView(exoplanet: ExoplanetDTO) {
    setAnimating(true);
    setAnimatingMenu(true);
    cameraControlRef.current?.lookInDirectionOf(exoplanet.x * 2, exoplanet.y * 2, exoplanet.z * 2, true);
    cameraControlRef.current?.moveTo(exoplanet.x * 2.1, exoplanet.y * 2.1, exoplanet.z * 2.1, true);

    setTimeout(() => navigate(`/${exoplanet.x}/${exoplanet.y}/${exoplanet.z}/${exoplanet.planet_id}`), 2000);
  }

  function onClose() {
    setAnimating(true);
    setSelectedExoplanet(undefined);
  }

  return (
    <div id="canvas-container" className={styles.canvasContainer}>
      <Canvas camera={{far: 5000, position: [6, 5, -2]}} className={styles.canvas}>
        <CameraControls ref={cameraControlRef}/>
        <Earth/>
        {!!exoplanets?.length && exoplanets.map((exoplanet: ExoplanetDTO) => <Exoplanet exoplanet={exoplanet}/>)}
        <ambientLight intensity={0.1}/>
      </Canvas>
      <div className={`${styles.divDisappears} ${animatingMenu ? styles.disappears : ''}`}><SelectionMenu
        clickHandler={clickHandler} exoplanets={exoplanets}/></div>
      <div className={`${styles.divDisappears} ${animating ? styles.disappears : ''}`}>
        <ExoplanetCard close={onClose} exoplanet={selectedExoplanet} skyView={onSkyView}/></div>
    </div>
  );
}
