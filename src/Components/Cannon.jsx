import React from "react";
import { useCanvas } from "../Hooks";

const Canvas = ({ draw, height, width }) => {
  const canvasRef = useCanvas(draw, height, width);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
