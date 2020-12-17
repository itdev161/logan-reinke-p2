import React, { useState, useEffect, useRef } from "react";
import { animated, config, interpolate, useSpring } from "react-spring";
import { flipCoin, randomFromArray, random } from "../utils/random";
import styled from "styled-components";

const Circle = (color, size) => (
  <circle
    cx={`${size / 2}`}
    cy={`${size / 2}`}
    r={`${(size / 2) * 0.6}`}
    fill={color}
  />
);

const Triangle = ({ color, size }) => {
  const flipped = flipCoin();
  return (
    <polygon
      points={`${size / 2},0 ${size},${random(
        flipped ? size / 2 : 0,
        size
      )} 0,${random(flipped ? 0 : size / 2, size)}`}
      fill={color}
    />
  );
};

const Square = ({ color, size }) => {
  const flipped = flipCoin();
  return (
    <rect
      height={`${random(0, flipped ? size : size / 2)}`}
      width={`${random(0, flipped ? size / 2 : size)}`}
      fill={color}
    />
  );
};

const getRandomShape = (color, size) => {
  const Shape = randomFromArray([Circle, Square, Triangle]);
  return <Shape color={color} size={size} />;
};

const Confetti = ({
  anchor,
  color,
  initialHorizontal = 50,
  initialUpwards = 100,
  rotate,
  size,
}) => {
  const { horizontal, opacity, upwards } = useSpring({
    config: config.default,
    from: {
      horizontal: initialHorizontal,
      opacity: 80,
      upwards: initialUpwards,
    },
    to: {
      horizontal: 0,
      opacity: 0,
      upwards: 0,
    },
  });

  let totalUpwards = 0;
  let totalHorizontal = 0;
  const startTime = new Date().getTime() / 1000;
  let lastTime = startTime;
  const gravityPerSecond = 30;

  return (
    <animated.svg
      style={{
        opacity,
        transform: interpolate([upwards, horizontal], (v, h) => {
          const currentTime = new Date().getTime() / 1000;
          const duration = currentTime - lastTime;
          const totalDuration = currentTime - startTime;
          const verticalTraveled = v * duration;
          const horizontalTraveled = h * duration;
          totalUpwards += verticalTraveled;
          totalHorizontal += horizontalTraveled;
          lastTime = currentTime;

          const totalGravity = gravityPerSecond * totalDuration;
          const finalX =  totalHorizontal;
          const finalY =  totalUpwards + totalGravity;

          return `translate3d(${finalX}px, ${finalY}px, 0) rotate(${rotate}deg)`;
        }),
      }}
    >
      {Circle(color, size)}
    </animated.svg>
  );
};

export default Confetti;
