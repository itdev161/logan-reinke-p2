import React, { useState, useEffect, useRef } from "react";
import { animated, config, interpolate, useSpring } from "react-spring";
import { flipCoin, randomFromArray, random } from "../utils/random";

const Confetti = ({ ctx, dpr, length, angle }) => {
  // some constants
  const DECAY = 4; // confetti decay in seconds
  const SPREAD = 60; // degrees to spread from the angle of the cannon
  const GRAVITY = 1200;

  const [confettiSprites, setConfettiSprites] = useState({});
  const [confettiSpriteIds, setConfettiSpriteIds] = useState([]);

  const amount = length / 5 + 5;
  const velocity = length * 10;

  const addConfettiParticles = (x, y) => {
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

      const newSpritIds = [...confettiSpriteIds, id];

      Object.assign(confettiSprites, sprite);
      setConfettiSpriteIds(newSpritIds);
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

  const drawConfetti = () => {
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

  return drawConfetti();
};

export default Confetti;

/**GRAVEYARD 
 * 
 * 
    return (
      <AnimatedConfettiDot
        style={{
          opacity,
          transform: interpolate([upwards, horizontal], (v, h) => {
            const currentTime = new Date().getTime() / 500;
            const duration = currentTime - lastTime;
            const totalDuration = currentTime - startTime;
            const verticalTraveled = v * duration;
            const horizontalTraveled = h * duration;
            totalUpwards += verticalTraveled;
            totalHorizontal += horizontalTraveled;
            lastTime = currentTime;

            const totalGravity = gravityPerSecond * totalDuration;
            const finalX = initialX + totalHorizontal;
            const finalY = initialY - totalUpwards + totalGravity;

            return `translate3d(${finalX}px, ${finalY}px, 0) rotate(${rotate}deg)`;
          }),
        }}
      >
        {getRandomShape(color, size)}
      </AnimatedConfettiDot>
    );

      const StyledConfettiDot = styled.svg`
    height: 10px;
    pointer-events: none;
    position: absolute;
    width: 10px;
    will-change: transform;
  `;

  
  const alignWithAnchor = (anchorRef) => {
    if (anchorRef.current == null) {
      return {
        initialX: 0,
        initialY: 0,
      };
    }

    
  const getRandomShape = (color, size) => {
    const Shape = randomFromArray([Circle]);
    return <Shape color={color} size={size} />;
  };

  const Dot = ({
    anchorRef,
    color,
    initialHorizontal,
    initialUpwards,
    rotate,
    size,
  }) => {
    let totalUpwards = 0;
    let totalHorizontal = 0;
    const startTime = new Date().getTime() / 500;
    let lastTime = startTime;
    const gravityPerSecond = 30;

    
    TweenLite.to(confettiSprites[id], DECAY, {
      physics2D: {
        velocity,
        angle,
        gravity,
        friction,
      },
      d,
      ease: Power4.easeIn,
      onComplete: () => {
        // remove confetti sprite and id
        pull(confettiSpriteIds, id);
        delete confettiSprites[id];
      },
    });
    
    //const AnimatedConfettiDot = animated(StyledConfettiDot);
    const { spread, opacity, angle } = useSpring({
      config: config.default,
      from: {
        velocity,
        angle,
        gravity,
        friction,
        opacity: 80,
      },
      to: {
        spread: 0,
        opacity: 0,
        angle: 0,
      },
    });
    
  const { height, width } = anchorRef.current.getBoundingClientRect();
 */
