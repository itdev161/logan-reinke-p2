import { useRef, useEffect } from "react";

export const useCanvas = (draw, height, width) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

/** GRAVEYARD
 * 

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();

      if (canvas.width !== width || canvas.height !== height) {
        const { devicePixelRatio: ratio = 1 } = window;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.scale(ratio, ratio);
        return true;
      }

      return false;
    };
    
    resizeCanvas();
 */
