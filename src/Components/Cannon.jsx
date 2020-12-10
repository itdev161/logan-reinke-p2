import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "../App.css";
import Canvas from "./Canvas";
import Background from "../img/group-shot-with-logo.svg";
import CustomCursor from "./CustomCursor";
import { useThrottle } from "../Hooks";

const Cannon = ({ height, width }) => {
  const [isHovered, setHover] = useState(false);
  const [mouseLocation, setMouseLocation] = useState(null);
  const [mouseAnchor, setMouseAnchor] = useState(null);
  const [previousAnchor, setPreviousAnchor] = useState(null)
  const throttle = useThrottle(mouseLocation, 60);

  const handleMouseMove = (e) => {
    if (!isHovered || throttle) return;
    setMouseLocation({ mouseX: e.clientX, mouseY: e.clientY });
  };

  const handleMouseDown = () => {
    if (!isHovered || mouseAnchor) return;
    setMouseAnchor(mouseLocation);
  };

  const handleMouseUp = (e) => {
    if (!isHovered && !mouseAnchor) return;
    setPreviousAnchor(mouseAnchor)
    setMouseAnchor(null);
  };

  const toggleHover = () => {
    handleMouseUp();
    setHover((prevIsHovered) => !prevIsHovered);
  };

  return (
    <div
      className="CTAContainer"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseDown={() => handleMouseDown()}
      onMouseUp={(e) => handleMouseUp(e)}
    >
      <Canvas
        height={height}
        width={width}
        mouseX={mouseLocation?.mouseX}
        mouseY={mouseLocation?.mouseY}
        anchor={mouseAnchor}
        previousAnchor={previousAnchor}
      />
    </div>
  );
};

export default Cannon;

/**GRAVEYARD
 * 
 * 
      <img
        className="backgroundImg"
        draggable="false"
        onDragStart={(e) => {
          e.preventDefault();
        }}
      />

      
      {isMouseOverCannon && <CustomCursor mouseX={mouseX} mouseY={mouseY} />}
 */
