export const randomFromArray = (array) =>
  array[random(0, array.length)];

export const flipCoin = () => Math.round(Math.random()) === 1;

export const random = (min, max) => {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};
