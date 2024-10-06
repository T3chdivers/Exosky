import { useThree } from '@react-three/fiber'
import { useEffect, useState, Raycaster, Vector2 } from 'react'

export function Camera() {
  const [clicked, setClicked] = useState(false);
  const [touched, setTouched] = useState(false);

  const [rotationOrigin, setRotationOrigin] = useState([0,0]);
  const [cursorOrigin, setCursorOrigin] = useState([0,0]);
  const { camera } = useThree();

  useEffect((event: MouseEvent) => {
    const handleClick = (cursor: MouseEvent) => {
      setRotationOrigin([camera.rotation.y, camera.rotation.x])
      setCursorOrigin([cursor.pageX, cursor.pageY])
      setClicked(true);
      
      const raycaster = new Raycaster();
      
      const x = ( cursor.clientX / window.innerWidth ) * 2 - 1;
      const y = - ( cursor.clientY / window.innerHeight ) * 2 + 1;
      
      raycaster.setFromCamera( new Vector2(x, y), camera );

      console.log(raycaster);
    }
    const handleClickRealease = () => {setClicked(false)}

    const handleTouch = (touch: TouchEvent) => {
      setRotationOrigin([camera.rotation.y, camera.rotation.x])
      setCursorOrigin([touch.targetTouches[0].clientX, touch.targetTouches[0].clientY])
      setTouched(true);
    }
    const handleTouchRealease = () => {setTouched(false)}

    addEventListener("touchstart", handleTouch);
    addEventListener("touchend", handleTouchRealease);

    addEventListener("mousedown", handleClick);
    addEventListener("mouseup", handleClickRealease);

    return () => {
      removeEventListener("touchstart", handleTouch);
      removeEventListener("touchend", handleTouchRealease);

      removeEventListener("mousedown", handleClick);
      removeEventListener("mouseup", handleClickRealease);
    }
  }, []);


  useEffect(() => {
    const handleMouseMove = (cursor: MouseEvent) => {
      const [xCursorOrigin, yCursorOrigin] = cursorOrigin;
      const xOffset = cursor.pageX - xCursorOrigin;
      const yOffset = cursor.pageY - yCursorOrigin; 

      const [xOrigin, yOrigin] = rotationOrigin;
      const velocity = 0.001
      camera.rotation.set(yOrigin + (yOffset * velocity), xOrigin + (xOffset * velocity), 0);
    };

    if (clicked) {
      addEventListener("mousemove", handleMouseMove);
    } else {
      removeEventListener("mousemove", handleMouseMove);
    }

    return () => removeEventListener("mousemove", handleMouseMove);
  }, [clicked]);

  useEffect(() => {
    const handleTouchMove = (touch: TouchEvent) => {
      const [xCursorOrigin, yCursorOrigin] = cursorOrigin;
      const xOffset = touch.targetTouches[0].clientX - xCursorOrigin;
      const yOffset = touch.targetTouches[0].clientY - yCursorOrigin; 

      const [xOrigin, yOrigin] = rotationOrigin;
      const velocity = 0.003
      camera.rotation.set(yOrigin + (yOffset * velocity), xOrigin + (xOffset * velocity), 0);
    };

    if (touched) {
      addEventListener("touchmove", handleTouchMove);
    } else {
      removeEventListener("touchmove", handleTouchMove);
    }

    return () => removeEventListener("touchmove", handleTouchMove);
  }, [touched]);

  return null;
}
