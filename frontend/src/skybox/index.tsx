import styles from './index.module.css'
import {Canvas} from "@react-three/fiber"
// import {Camera} from "./CameraController"
import {Star} from "./Star"
import {useEffect, useRef, useState} from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import {Loader} from "../exoplanets/Loader.tsx";
import {CameraControls} from "@react-three/drei";

export type StarDTO = {
  color: string;
  dec: number;
  dist: number;
  mag: number;
  ra: number;
}

export function Skybox() {
  const [stars, setStars] = useState<StarDTO[] | undefined>();
  const [magMin, setMagMin] = useState(-3);
  const [magMax, setMagMax] = useState(10);
  const [loading, setLoading] = useState(true);
  const {x, y, z, name} = useParams();

  const cameraControlRef = useRef<CameraControls | null>(null);

  useEffect(() => {
    axios.get(
      "https://exosky-api.dixen.fr/stars/",
      {params: {x: Number(x), y: Number(y), z: Number(z), max_star_nb: 20000, search_distance: 200}}
    ).then((response: any) => {
      setStars(response.data);
      setMagMin(Math.min(...response.data.map((star: StarDTO) => star.mag)));
      setMagMax(Math.max(...response.data.map((star: StarDTO) => star.mag)));
      setLoading(false);
    });
  }, []);

  return (<div>
    <div id="canvas-container" className={styles.canvasContainer}>
      <Canvas camera={{fov: 80, far: 10000}} className={styles.canvas}>
        <CameraControls polarRotateSpeed={0.5} azimuthRotateSpeed={0.5} dollySpeed={0} ref={cameraControlRef}/>
        {!!stars?.length &&
          stars.map((star) => <Star star={star} magMax={magMax} magMin={magMin}/>)
        }
        <ambientLight intensity={0.1}/>
      </Canvas>
    </div>
    {loading && <div className={styles.loader}>
        <Loader/>
    </div>}
    {!loading && <div className={styles.topBar}>
        <button onClick={() => window.history.back()} className={`${styles.topBarContainer} ${styles.returnButton}`}>
            ←
        </button>
        <div className={styles.topBarContainer}>
            <p>🪐 {name}</p>
        </div>
        <div className={styles.topBarContainer}>
            <p>⭐ {stars?.length || 0} Stars</p>
        </div>
    </div>}
  </div>);
}
