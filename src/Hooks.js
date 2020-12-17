import { useRef, useEffect, useState } from "react";
import { animated, config, interpolate, useSpring } from "react-spring";
import { flipCoin, randomFromArray, random } from "./utils/random";
import { gsap, TweenMax, Power4 } from "gsap";
import _ from "lodash";
const confetti = require("canvas-confetti");

export const useCanvas = (
  height,
  width,
  mouseX,
  mouseY,
  anchor,
  isHovered,
  previousAnchor,
  setPreviousAnchor
) => {
  const DECAY = 4; // confetti decay in seconds
  const SPREAD = 30; // degrees to spread from the angle of the cannon
  const GRAVITY = 1200;
  const gravityPerSecond = 30;
  const dpr = window.devicePixelRatio || 1;
  const confettiSprites = [];
  const confettiSpriteIds = [];

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const getLength = (x0, anchorY, currentX, currentY) => {
    // returns the length of a line segment
    const x = currentX - x0;
    const y = currentY - anchorY;
    return Math.sqrt(x * x + y * y);
  };

  const getDegAngle = (x0, anchorY, currentX, currentY) => {
    const y = currentY - anchorY;
    const x = currentX - x0;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const drawPointer = (currentX, currentY) => {
    const radius = 15 * dpr;
    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );
    ctxRef.current.beginPath();
    ctxRef.current.arc(currentX, currentY, radius, 0, 2 * Math.PI, false);
    ctxRef.current.fillStyle = "transparent";
    ctxRef.current.fill();
    ctxRef.current.lineWidth = 2;
    ctxRef.current.strokeStyle = "#ffffff";
    ctxRef.current.stroke();
  };

  const drawLine = (x0, anchorY, currentX, currentY) => {
    if (!currentX || !currentY) return;
    ctxRef.current.strokeStyle = "#01a0b6";
    ctxRef.current.lineWidth = 2 * dpr;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x0, anchorY);
    ctxRef.current.lineTo(currentX, currentY);
    ctxRef.current.stroke();
  };

  const drawPower = (x0, anchorY, length) => {
    if (!length) return;
    const centerX = x0;
    const centerY = anchorY;
    const radius = (1 * dpr * length) / 20;
    const color = `hsl(187, 99%, ${(20 * length) / 200}%)`;
    ctxRef.current.beginPath();
    ctxRef.current.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctxRef.current.fillStyle = "transparent";
    ctxRef.current.fill();
    ctxRef.current.lineWidth = 2 * dpr;
    ctxRef.current.strokeStyle = color;
    ctxRef.current.stroke();
  };

  const addConfettiParticles = (x, y, prevLength, amount, angle) => {
    let i = 0;
    while (i < amount) {
      const r = random(4, 6) * dpr;
      const d = random(15, 25) * dpr;

      const cr = random(30, 255);
      const cg = random(30, 230);
      const cb = random(30, 230);
      const color = `rgb(${cr}, ${cg}, ${cb})`;

      const tilt = random(10, -10);
      const tiltAngleIncremental = random(0.07, 0.05);
      const tiltAngle = 0;

      const velocity = prevLength * 10;
      // const minVelocity = baseVelocity / 4;
      // const maxVelocity = baseVelocity;
      // const velocity = random(minVelocity, maxVelocity);

      // const minAngle = baseAngle - SPREAD / 2;
      // const maxAngle = baseAngle + SPREAD / 2;
      // const angle = random(minAngle, maxAngle);

      const id = i;
      let sprite = {
        id,
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
      };

      //Object.assign(confettiSprites, sprite);
      confettiSprites.push(sprite);
      //console.log(_.size(confettiSprites));
      confettiSpriteIds.push(id);
      tweenConfettiParticle(id);
      i++;
    }
  };

  // const springConfettiParticle = (id) => {
  //   const minAngle = confettiSprites[id].angle - SPREAD / 2;
  //   const maxAngle = confettiSprites[id].angle + SPREAD / 2;

  //   const minVelocity = confettiSprites[id].velocity / 4;
  //   const maxVelocity = confettiSprites[id].velocity;

  //   // Physics Props
  //   const velocity = random(minVelocity, maxVelocity);
  //   const angle = random(minAngle, maxAngle);
  //   const gravity = GRAVITY;
  //   const friction = random(0.1, 0.25);
  //   const d = 0;
  // };

  const tweenConfettiParticle = (id) => {
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

    TweenMax.to(confettiSprites[id], {
      duration: DECAY,
      ease: Power4.easeIn,
      onComplete: () => {
        // remove confetti sprite and id
        confettiSpriteIds.splice(id, 1);
        confettiSprites.splice(id, 1);
      },
    });
  };

  const updateConfettiParticle = (id) => {
    if (confettiSprites[id]) {
      const sprite = confettiSprites[id];
      let newTiltAngle = 0.0005 * sprite?.d;
      newTiltAngle += sprite?.tiltAngle;
      newTiltAngle += sprite?.tiltAngleIncremental;

      const newY = sprite?.y + Math.sin(sprite?.angle + sprite?.r / 2) * 2;
      const newX = sprite?.x + Math.cos(sprite?.angle) / 2;
      const newAngle = sprite?.angle + 0.01;
      const newTilt =
        Math.sin(sprite?.tiltAngle - sprite?.r / 2) * sprite?.r * 2;
      // sprite.y += Math.sin(sprite.angle + sprite.r / 2) * 2;
      // sprite.x += Math.cos(sprite.angle) / 2;
      if (confettiSprites[id]) {
        confettiSprites[id].tilt = newTilt;
        confettiSprites[id].angle = newAngle;
        confettiSprites[id].x = newX;
        confettiSprites[id].y = newY;
        confettiSprites[id].tiltAngle = newTiltAngle;
      }
    }
  };

  const drawConfetti = () => {
    confettiSpriteIds.map((id) => {
      const sprite = confettiSprites[id];

      ctxRef.current.beginPath();
      ctxRef.current.lineWidth = sprite?.d / 2;
      ctxRef.current.strokeStyle = sprite?.color;
      ctxRef.current.moveTo(sprite?.x + sprite?.tilt + sprite?.r, sprite?.y);
      ctxRef.current.lineTo(
        sprite?.x + sprite?.tilt,
        sprite?.y + sprite?.tilt + sprite?.r
      );
      ctxRef.current.stroke();

      updateConfettiParticle(id);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    canvas.width = width;
    canvas.height = height;

    ctxRef.current = context;
  }, []);

  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const rect = canvasRef.current.getBoundingClientRect();
      const anchorX = anchor?.mouseX - rect.left;
      const anchorY = anchor?.mouseY - rect.top;
      const currentX = mouseX - rect.left;
      const currentY = mouseY - rect.top;
      const prevX = previousAnchor?.mouseX - rect.left;
      const prevY = previousAnchor?.mouseY - rect.top;
      const length = getLength(anchorX, anchorY, currentX, currentY);
      const prevLength = getLength(prevX, prevY, currentX, currentY);

      const amount = prevLength / 50 + 5;
      drawPointer(currentX, currentY);
      drawLine(anchorX, anchorY, currentX, currentY);
      drawPower(anchorX, anchorY, length);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  });

  return canvasRef;
};

export const useThrottle = (event, fps) => {
  const [throttle, setThrottle] = useState(false);
  const renderCount = useRef(0);
  const SECOND = 1000;
  const limit = SECOND / fps;

  useEffect(() => {
    if (renderCount.current < limit) {
      renderCount.current = renderCount.current + 1;
    } else if (renderCount.current > limit) {
      setThrottle(true);
      const handler = setTimeout(() => {
        renderCount.current = 0;
        setThrottle(false);
      }, limit);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [event]);

  return throttle;
};

export const useConfetti = (
  height,
  width,
  mouseX,
  mouseY,
  anchor,
  isHovered,
  previousAnchor,
  setPreviousAnchor,
  currentTime
) => {
  const DECAY = 4; // confetti decay in seconds
  const SPREAD = 60; // degrees to spread from the angle of the cannon
  const GRAVITY = 1200;
  const gravityPerSecond = 30;
  const dpr = window.devicePixelRatio || 1;
  let confettiSprites = [];
  let confettiSpriteIds = [];

  const confettiRef = useRef(null);
  const spriteRef = useRef(null);
  const spriteIdRef = useRef(null);
  const ctxRef = useRef(null);
  const renderCount = useRef(0);
  const handler = useRef(null);

  const getLength = (x0, anchorY, currentX, currentY) => {
    // returns the length of a line segment
    const x = currentX - x0;
    const y = currentY - anchorY;
    return Math.sqrt(x * x + y * y);
  };

  const getDegAngle = (prevX, prevY, currentX, currentY) => {
    const y = currentY - prevY;
    const x = currentX - prevX;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const addConfettiParticles = (x, y, prevLength, amount, baseAngle) => {
    let i = 0;
    while (i < amount) {
      const r = random(4, 6) * dpr;
      const d = random(15, 25) * dpr;

      const cr = random(30, 255);
      const cg = random(30, 230);
      const cb = random(30, 230);
      const color = `rgb(${cr}, ${cg}, ${cb})`;

      const tilt = random(10, -10);
      const tiltAngleIncremental = random(0.07, 0.05);
      const tiltAngle = 0;

      const baseVelocity = prevLength / 10;

      const minVelocity = baseVelocity / 4;
      const maxVelocity = baseVelocity;

      // Physics Props
      const velocity = random(minVelocity, maxVelocity);

      const minAngle = baseAngle - SPREAD / 2;
      const maxAngle = baseAngle + SPREAD / 2;

      const angle = random(minAngle, maxAngle);
      // const minVelocity = baseVelocity / 4;
      // const maxVelocity = baseVelocity;
      // const velocity = random(minVelocity, maxVelocity);

      // const minAngle = baseAngle - SPREAD / 2;
      // const maxAngle = baseAngle + SPREAD / 2;
      // const angle = random(minAngle, maxAngle);

      const id = i;
      let sprite = {
        id,
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
      };

      //Object.assign(confettiSprites, sprite);
      confettiSprites.push(sprite);
      //console.log(_.size(confettiSprites));
      confettiSpriteIds.push(id);
      spriteRef.current = confettiSprites;
      spriteIdRef.current = confettiSpriteIds;
      i++;
    }
    renderCount.current = renderCount.current + 1;
  };

  // const springConfettiParticle = (id) => {
  //   const minAngle = confettiSprites[id].angle - SPREAD / 2;
  //   const maxAngle = confettiSprites[id].angle + SPREAD / 2;

  //   const minVelocity = confettiSprites[id].velocity / 4;
  //   const maxVelocity = confettiSprites[id].velocity;

  //   // Physics Props
  //   const velocity = random(minVelocity, maxVelocity);
  //   const angle = random(minAngle, maxAngle);
  //   const gravity = GRAVITY;
  //   const friction = random(0.1, 0.25);
  //   const d = 0;
  // };

  const tweenConfettiParticle = (id) => {
    const gravity = GRAVITY;
    const d = 0;

    // TweenMax.to(confettiSprites[id], {
    //   duration: DECAY,
    //   ease: Power4.easeIn,
    //   onComplete: () => {
    //     // remove confetti sprite and id
    //     confettiSpriteIds.splice(id, 1);
    //     confettiSprites.splice(id, 1);
    //   },
    // });
  };

  const updateConfettiParticle = (id) => {
    if (confettiSprites[id]) {
      const friction = random(0.1, 0.25);
      const sprite = confettiSprites[id];
      let newTiltAngle = 0.0005 * sprite?.d;
      newTiltAngle += sprite?.tiltAngle;
      const newVelocity = sprite?.velocity * friction;
      console.log(newVelocity);

      const newY = sprite?.y - Math.sin(sprite?.r / 2) * friction;
      const newX = sprite?.x + Math.cos(sprite?.angle) + newVelocity;
      const newAngle = sprite?.angle - 0.01;
      const newTilt =
        Math.sin(sprite?.tiltAngle - sprite?.r / 2) * sprite?.r * 2;
      // sprite.y += Math.sin(sprite.angle + sprite.r / 2) * 2;
      // sprite.x += Math.cos(sprite.angle) / 2;
      if (confettiSprites[id]) {
        confettiSprites[id].tilt = newTilt;
        confettiSprites[id].angle = newAngle;
        confettiSprites[id].x = newX;
        confettiSprites[id].y = newY;
        confettiSprites[id].tiltAngle = newTiltAngle;
        confettiSprites[id].velocity = newVelocity;
      }
    }
  };

  const drawConfetti = () => {
    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );
    confettiSpriteIds.map((id) => {
      const sprite = confettiSprites[id];
      console.log(sprite);
      ctxRef.current.beginPath();
      ctxRef.current.lineWidth = sprite?.d / 2;
      ctxRef.current.strokeStyle = sprite?.color;
      ctxRef.current.moveTo(sprite?.x + sprite?.tilt + sprite?.r, sprite?.y);
      ctxRef.current.lineTo(
        sprite?.x + sprite?.tilt,
        sprite?.y + sprite?.tilt + sprite?.r
      );
      ctxRef.current.stroke();

      updateConfettiParticle(id);
    });
  };

  useEffect(() => {
    const canvas = confettiRef.current;
    const context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    canvas.width = width;
    canvas.height = height;

    ctxRef.current = context;
  }, []);

  useEffect(() => {
    let animationFrameId;
    const SECOND = 1000;
    const limit = SECOND;

    const render = () => {
      const rect = confettiRef.current.getBoundingClientRect();
      const anchorX = anchor?.mouseX - rect.left;
      const anchorY = anchor?.mouseY - rect.top;
      const currentX = mouseX - rect.left;
      const currentY = mouseY - rect.top;
      const prevX = previousAnchor?.mouseX - rect.left;
      const prevY = previousAnchor?.mouseY - rect.top;
      const length = getLength(anchorX, anchorY, currentX, currentY);
      const prevLength = getLength(prevX, prevY, currentX, currentY);

      const amount = prevLength / 50 + 5;
      drawConfetti();
      if (previousAnchor && !anchor) {
        const baseAngle = getDegAngle(prevX, prevY, currentX, currentY);
        addConfettiParticles(prevX, prevY, prevLength, amount, baseAngle);
      }
      animationFrameId = window.requestAnimationFrame(render);
      renderCount.current = renderCount.current + 1;
    };

    render();

    handler.current = setTimeout(() => {
      window.cancelAnimationFrame(animationFrameId);
      confettiSprites = [];
      confettiSpriteIds = [];
      renderCount.current = 0;
      ctxRef.current.clearRect(
        0,
        0,
        ctxRef.current.canvas.width,
        ctxRef.current.canvas.height
      );
    }, 5000);
    console.log(renderCount.current);

    return () => {
      ctxRef.current.clearRect(
        0,
        0,
        ctxRef.current.canvas.width,
        ctxRef.current.canvas.height
      );
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [previousAnchor]);

  return confettiRef;
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
          addConfettiParticles(x0, anchorY, amount, angle, velocity)
          drawConfetti(ctx);
      }
 */
