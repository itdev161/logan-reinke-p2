import React from "react";
import Confetti from "./Confetti";
import { flipCoin, randomFromArray, random } from "../utils/random";

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

const randomIntInRange = (min, max) => Math.floor(randomInRange(min, max));

const colors = ["blue", "red", "yellow", "purple"]

const ConfettiCannon = ({ anchorRef, dotCount }) => (
  <>
    {new Array(dotCount).fill().map((_, index) => (
      <Confetti
        key={index}
        anchor={anchorRef}
        color={colors[randomIntInRange(0, colors.length)]}
        initialHorizontal={randomInRange(-250, 250)}
        initialUpwards={randomInRange(200, 700)}
        rotate={randomInRange(0, 360)}
        size={randomInRange(8, 12)}
      />
    ))}
  </>
);

export default ConfettiCannon;
