import { useRef, useEffect, useState, useCallback } from "react";
import { animated, config, interpolate, useSpring } from "react-spring";
import { flipCoin, randomFromArray, random } from "./utils/random";

export const useCanvas = (
  height,
  width,
  mouseX,
  mouseY,
  anchor,
  fireCannon
) => {
  const DECAY = 4; // confetti decay in seconds
  const SPREAD = 60; // degrees to spread from the angle of the cannon
  const GRAVITY = 1200;

  const [confettiSprites, setConfettiSprites] = useState({});
  const [confettiSpriteIds, setConfettiSpriteIds] = useState([]);


  const getLength = (x0, y0, x1, y1) => {
    // returns the length of a line segment
    const x = x1 - x0;
    const y = y1 - y0;
    return Math.sqrt(x * x + y * y);
  };

  const getDegAngle = (x0, y0, x1, y1) => {
    const y = y1 - y0;
    const x = x1 - x0;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  // const angle = getDegAngle(x0, y0, x1, y1) + 180;
  // const amount = 3;
  // const velocity = length * 10;

  const canvasRef = useRef(null);
  const mouseRefX = useRef(null);
  const mouseRefY = useRef(null);
  
  const dpr = window.devicePixelRatio || 1;

  const drawPointer = useCallback(
    (ctx) => {
      const radius = 15 * dpr;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.beginPath();
      ctx.arc(
        mouseX,
        mouseY - ctx.canvas.height / 2,
        radius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = "transparent";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    },
    [mouseY, mouseX]
  );

  const drawLine = (ctx, x0, y0, x1, y1) => {
    if (!x0 || !y0) return;
    ctx.strokeStyle = "#01a0b6";
    ctx.lineWidth = 2 * dpr;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const drawPower = (ctx, x0, y0, length) => {
    if (!length) return;
    const centerX = x0;
    const centerY = y0;
    const radius = (1 * dpr * length) / 20;
    const color = `hsl(187, 99%, ${(20 * length) / 200}%)`;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "transparent";
    ctx.fill();
    ctx.lineWidth = 2 * dpr;
    ctx.strokeStyle = color;
    ctx.stroke();
  };

  const addConfettiParticles = (x, y, amount, angle, velocity) => {
    let i = 0;
    while (i < amount) {
      // sprite
      const r = random(4, 6) * dpr;
      const d = random(15, 25) * dpr;

      const cr = random(30, 255);
      const cg = random(30, 230);
      const cb = random(30, 230);
      const color = `rgb(${cr}, ${cg}, ${cb})`;

      const tilt = random(10, -10);
      const tiltAngleIncremental = random(0.07, 0.05);
      const tiltAngle = 0;

      const id = random(-10000, 10000);
      const sprite = {
        [id]: {
          angle,
          velocity,
          x,
          y,
          r,
          d,
          color,
          tilt,
          tiltAngleIncremental,
          tiltAngle,
        },
      };

      const newSpriteIds = [...confettiSpriteIds, id];

      Object.assign(confettiSprites, sprite);
      setConfettiSpriteIds(newSpriteIds);
      springConfettiParticle(id);
      i++;
    }
  };

  const springConfettiParticle = (id) => {
    const minAngle = confettiSprites[id].angle - SPREAD / 2;
    const maxAngle = confettiSprites[id].angle + SPREAD / 2;

    const minVelocity = confettiSprites[id].velocity / 4;
    const maxVelocity = confettiSprites[id].velocity;

    // Physics Props
    const velocity = random(minVelocity, maxVelocity);
    const angle = random(minAngle, maxAngle);
    const gravity = GRAVITY;
    const friction = random(0.1, 0.25);
    const d = 0;
  };

  const updateConfettiParticle = (id) => {
    const sprite = confettiSprites[id];

    const tiltAngle = 0.0005 * sprite.d;

    sprite.angle += 0.01;
    sprite.tiltAngle += tiltAngle;
    sprite.tiltAngle += sprite.tiltAngleIncremental;
    sprite.tilt = Math.sin(sprite.tiltAngle - sprite.r / 2) * sprite.r * 2;
    sprite.y += Math.sin(sprite.angle + sprite.r / 2) * 2;
    sprite.x += Math.cos(sprite.angle) / 2;
  };

  const drawConfetti = (ctx) => {
    confettiSpriteIds.map((id) => {
      const sprite = confettiSprites[id];

      ctx.beginPath();
      ctx.lineWidth = sprite.d / 2;
      ctx.strokeStyle = sprite.color;
      ctx.moveTo(sprite.x + sprite.tilt + sprite.r, sprite.y);
      ctx.lineTo(sprite.x + sprite.tilt, sprite.y + sprite.tilt + sprite.r);
      ctx.stroke();

      updateConfettiParticle(id);
    });
  };

  useEffect(() => {
    
  })

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvasRef);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    canvas.width = width;
    canvas.height = height;
    let animationFrameId;

    const renderCursor = () => {
      drawPointer(ctx);
      animationFrameId = window.requestAnimationFrame(renderCursor);
    };

    const renderLineAndPower = () => {
      const x0 = anchor?.x;
      const y0 = anchor?.y - ctx.canvas.height / 2;
      const x1 = mouseX;
      const y1 = mouseY - ctx.canvas.height / 2;

      const length = getLength(x0, y0, x1, y1);

      drawLine(ctx, x0, y0, x1, y1);
      drawPower(ctx, x0, y0, length);
    };

    renderCursor();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);
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
      if(anchor !== false){
          addConfettiParticles(x0, y0, amount, angle, velocity)
          drawConfetti(ctx);
      }
 */
