import React from "react";
import { useCanvas, useConfetti } from "../Hooks";
import { random } from "../utils/random";

const Canvas = ({
  height,
  width,
  mouseX,
  mouseY,
  anchor,
  isHovered,
  previousAnchor,
  confettiSprites,
  setConfettiSprites,
  setConfettiSpriteIds,
  confettiSpriteIds,
  setPreviousAnchor,
  currentTime,
}) => {
  const confettiRef = useConfetti(
    height,
    width,
    mouseX,
    mouseY,
    anchor,
    isHovered,
    previousAnchor,
    confettiSprites,
    setConfettiSprites,
    setConfettiSpriteIds,
    confettiSpriteIds,
    setPreviousAnchor,
    currentTime
  );
  const canvasRef = useCanvas(
    height,
    width,
    mouseX,
    mouseY,
    anchor,
    isHovered,
    previousAnchor,
    confettiSprites,
    setConfettiSprites,
    setConfettiSpriteIds,
    confettiSpriteIds,
    setPreviousAnchor
  );
  return (
    <React.Fragment>
      <canvas style={{ position: "relative" }} ref={canvasRef} />
      <canvas
        style={{ position: "absolute", top: "0", left: "0" }}
        ref={confettiRef}
      />
    </React.Fragment>
  );
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
