import { useRef, useState } from "react"
import { TextureLoader } from "three"
import { useLoader, useFrame } from "@react-three/fiber"

export function Earth() {
  const [easterClick, setEasterClick] = useState(0);
  const texture = useLoader(TextureLoader, 'earth_texture.jpg');
  const lightTexture = useLoader(TextureLoader, 'light_texture.jpg');
  const cloudTexture = useLoader(TextureLoader, 'cloud_texture.jpg');
  const waterTexture = useLoader(TextureLoader, 'water_texture.jpg');

  const earthRef = useRef<any>();
  const cloudRef = useRef<any>();

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta/20;
    if (earthRef.current) earthRef.current.rotation.y += delta/15;
  });

  return (
    <>
      <mesh ref={earthRef} position={[0, 0, 0]} onClick={() => setEasterClick((value) => value + 1)}>
        {easterClick >= 20 ? <cylinderGeometry args={[3, 3, 0.1, 32, 1]} /> : <sphereGeometry args={[2, 32, 32]} />}
        <meshStandardMaterial map={texture} emissiveMap={lightTexture} emissive={"#666666"} metalnessMap={waterTexture}/>
      </mesh>
      <mesh ref={cloudRef} position={[0, 0, 0]} scale={1.02}>
        {easterClick >= 20 ? <cylinderGeometry args={[3, 3, 0.1, 32, 1]}/> : <sphereGeometry args={[2, 32, 32]} />}
        <meshStandardMaterial alphaMap={cloudTexture} transparent/>
      </mesh>
      <pointLight position={[0,40,-100]} intensity={100000} color={"#fff2d1"}/>
      <pointLight position={[-60,-20,40]} intensity={100000} color={"#ffd1f2"}/>
    </>
  );
}
