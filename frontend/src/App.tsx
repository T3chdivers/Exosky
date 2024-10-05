import styles from './App.module.css'
import { Canvas } from "@react-three/fiber"
import { Camera } from "./skybox/Camera"


function App() {
  return (
    <div id="canvas-container" className={styles.canvasContainer}>
      <Canvas camera={{position: [0,0,5]}} className={styles.canvas}>
        <Camera/>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="red" />
      </Canvas>
    </div>
  )
}

export default App
