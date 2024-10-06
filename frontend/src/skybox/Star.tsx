import {MathUtils, Vector3} from "three"
import {Star as StarDTO} from "."

type StarProps = {
  star: StarDTO;
}

export function Star({star}: StarProps) {
  const distance = 6000;

  // Convert degrees to radians
  const yawRad = MathUtils.degToRad(star.dec);
  const pitchRad = MathUtils.degToRad(star.ra);

  // Calculate the direction vector
  const direction = new Vector3();
  direction.x = Math.cos(pitchRad) * Math.sin(yawRad);
  direction.y = Math.sin(pitchRad);
  direction.z = Math.cos(pitchRad) * Math.cos(yawRad);

  // Normalize the direction vector and scale it by the distance
  direction.normalize().multiplyScalar(distance);

  return (
    <mesh position={[direction.x, direction.y, direction.z]} scale={star.mag}>
      <sphereGeometry args={[2, 8, 8]}/>
      <meshStandardMaterial emissive={star.color} />
    </mesh>
  );
}
