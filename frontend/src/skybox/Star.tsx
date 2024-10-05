import {MathUtils, Vector3} from "three"

type StarProps = {
  yaw: number;
  pitch: number;
}

export function Star({yaw, pitch}: StarProps) {
  const distance = 3000;

  // Convert degrees to radians
  const yawRad = MathUtils.degToRad(yaw);
  const pitchRad = MathUtils.degToRad(pitch);

  // Calculate the direction vector
  const direction = new Vector3();
  direction.x = Math.cos(pitchRad) * Math.sin(yawRad);
  direction.y = Math.sin(pitchRad);
  direction.z = Math.cos(pitchRad) * Math.cos(yawRad);
  
  // Normalize the direction vector and scale it by the distance
  direction.normalize().multiplyScalar(distance);

  return (
    <mesh position={[direction.x, direction.y, direction.z]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial emissive={"white"} />
    </mesh>
  );
}
