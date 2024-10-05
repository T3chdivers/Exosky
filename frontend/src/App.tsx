import styles from './App.module.css'
import { Canvas } from "@react-three/fiber"
import { Camera } from "./skybox/CameraController"
import { Star } from "./skybox/Star"


function App() {
  return (
    <div id="canvas-container" className={styles.canvasContainer}>
      <Canvas camera={{fov: 10, far: 5000}}className={styles.canvas}>
        <Camera/>
        {
          Array.from({ length: 5000 }, (_) => {
            const yaw = Math.floor(Math.random() * 360) + Math.random();
            const pitch = Math.floor(Math.random() * 360) + Math.random();
            return <Star yaw={yaw} pitch={pitch}/>;
          })
        }
        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  )
}

export default App
