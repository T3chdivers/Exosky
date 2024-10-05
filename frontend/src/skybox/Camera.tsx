import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'

export function Camera() {
  const [grabbed, setGrabbed] = useState(false);
  const [rotationOrigin, setRotationOrigin] = useState([0,0]);
  const [cursorOrigin, setCursorOrigin] = useState([0,0]);
  const { camera } = useThree();

  useEffect(() => {
    const handleClick = (cursor: MouseEvent) => {
      console.log("camera", camera.rotation._x, camera.rotation._y);
      console.log("cursor", cursor.pageX, cursor.pageY)

      setRotationOrigin([camera.rotation._y, camera.rotation._x])
      setCursorOrigin([cursor.pageX, cursor.pageY])
      setGrabbed(true);
    }
    const handleClickRealease = () => {setGrabbed(false)}

    addEventListener("mousedown", handleClick);
    addEventListener("mouseup", handleClickRealease);

    return () => {
      removeEventListener("mousedown", handleClick);
      removeEventListener("mouseup", handleClickRealease);
    }
  }, []);


  useEffect(() => {
    const handleMouseMove = (cursor: MouseEvent) => {
      console.log(rotationOrigin);
      console.log(cursorOrigin);
      const [xCursorOrigin, yCursorOrigin] = cursorOrigin;

      const xOffset = cursor.pageX - xCursorOrigin;
      const yOffset = cursor.pageY - yCursorOrigin; 

      console.log(xOffset, yOffset);

      const [xOrigin, yOrigin] = rotationOrigin;
      const velocity = 0.003
      camera.rotation.set(yOrigin + (yOffset * velocity), xOrigin + (xOffset * velocity), 0);
    };

    if (grabbed) {
      addEventListener("mousemove", handleMouseMove);
    } else {
      removeEventListener("mousemove", handleMouseMove);
    }

    return () => removeEventListener("mousemove", handleMouseMove);
  }, [grabbed]);

  return null;
}
