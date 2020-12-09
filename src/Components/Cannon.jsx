import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
import Canvas from "./Canvas";
import Background from "../img/group-shot-with-logo.svg";
import CustomCursor from "./CustomCursor";

const Cannon = ({ height, width }) => {
  const [isHovered, setHover] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [mouseAnchor, setMouseAnchor] = useState(null);
  const [isCannonActive, setCannonActive] = useState(false);

  const handleMouseEnterCannon = () => {
    if (isHovered) return;
    setHover(true);
  };

  const handleMouseLeaveCannon = () => {
    if (!isHovered) return;
    setHover(false);
    setMouseAnchor(null);
  };

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  const handleMouseDown = (e) => {
    if (!isHovered) return;
    setMouseAnchor({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = (e) => {
    if (!isHovered || !mouseAnchor) return;
    setCannonActive(prevIsCannonActive => !prevIsCannonActive);
    setMouseAnchor(null);
  };


  return (
    <div
      className="CTAContainer"
      onMouseEnter={() => {setHover((prevIsHovered) => !prevIsHovered)}}
      onMouseLeave={() => {setHover(prevIsHovered => !prevIsHovered)}}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={() => handleMouseUp()}
    >
      <Canvas
        height={height}
        width={width}
        mouseX={mouseX}
        mouseY={mouseY}
        anchor={mouseAnchor} 
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
