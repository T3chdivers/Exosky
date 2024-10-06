import { useRef } from "react"
import { TextureLoader } from "three"
import { useLoader, useFrame } from "@react-three/fiber"

export function Earth() {
  const texture = useLoader(TextureLoader, 'earth_texture.jpg');
  const lightTexture = useLoader(TextureLoader, 'light_texture.jpg');
  const cloudTexture = useLoader(TextureLoader, 'cloud_texture.jpg');

  const earthRef = useRef<any>();
  const cloudRef = useRef<any>();

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y -= delta/50;
    if (earthRef.current) earthRef.current.rotation.y += delta/15;
  });

  return (
    <>
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial map={texture} emissiveMap={lightTexture} emissive={"#666666"}/>
      </mesh>
      <mesh ref={cloudRef} position={[0, 0, 0]} scale={1.02}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial alphaMap={cloudTexture} transparent/>
      </mesh>
      <pointLight position={[0,40,-100]} intensity={100000} color={"#fff2d1"}/>
    </>
  );
}
