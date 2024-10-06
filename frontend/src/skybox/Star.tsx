import {MathUtils, Vector3} from "three"
import {StarDTO} from "."

type StarProps = {
  star: StarDTO;
  magMax: number;
  magMin: number;
}

export function Star({star, magMin, magMax}: StarProps) {
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
    <mesh position={[direction.x, direction.y, direction.z]} scale={14 * scaleValue(star.mag)}>
      <sphereGeometry args={[2, 8, 8]}/>
      <meshStandardMaterial transparent opacity={scaleValue(star.mag, magMin, magMax)} emissive={star.color}/>
    </mesh>
  );
}

function scaleValue(input: number, inputMin: number = -3, inputMax: number = 10): number {
  const outputMin: number = 1;
  const outputMax: number = 0.30;

  if (input < inputMin) return outputMin;
  if (input > inputMax) return outputMax;

  const scaledInput: number = (input - inputMin) / (inputMax - inputMin);
  return outputMin + scaledInput * (outputMax - outputMin);
}
