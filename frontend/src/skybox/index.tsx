import styles from './index.module.css'
import { Canvas } from "@react-three/fiber"
import { Camera } from "./CameraController"
import { Star } from "./Star"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

export type Star = {
  color: string;
  dec: number;
  dist: number;
  mag: number;
  ra: number;
}

export function Skybox() {
  const [stars, setStars] = useState<Star[] | undefined>();
  const { x, y ,z } = useParams();
  
  useEffect(() => {
    axios.get(
      "https://exosky-api.dixen.fr/stars/", 
      {params: { x: Number(x), y: Number(y), z:Number(z), max_star_nb: 20000, search_distance: 200 }}
    ).then((response: any) => { setStars(response.data) });
  }, [x, y, z]);

  return (
    <div id="canvas-container" className={styles.canvasContainer}>
      <Canvas camera={{fov: 80,far: 10000}}className={styles.canvas}>
        <Camera/>
        { !!stars?.length &&
          stars.map((star) => <Star star={star}/>)
        }
        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  );
}
