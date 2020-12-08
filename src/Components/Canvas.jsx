import React from "react";
import { useCanvas } from "../Hooks";

const Canvas = ({draw, height, width}) => {
  const canvasRef = useCanvas(draw, height, width);

  return <canvas ref={canvasRef} />;
};

export default Canvas;

/**GRAVEYARD
 * 
 * 
  const { draw, ...rest } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
 */
