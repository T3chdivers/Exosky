import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { ExoplanetDTO } from "."

type ExoplanetProps = {
  exoplanet: ExoplanetDTO
}


export function Exoplanet({exoplanet}: ExoplanetProps) {
  const ref = useRef<any>();
  const eloignmentVector = 2;

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta/15
    }
  });
  
  console.log("oui")

  return (
    <mesh ref={ref} position={[exoplanet.x * eloignmentVector, exoplanet.y * eloignmentVector, exoplanet.z * eloignmentVector]} scale={0.03}>
      <sphereGeometry args={[2, 8, 8]} />
      <meshStandardMaterial emissive={`white`} />
    </mesh>
  );
}
