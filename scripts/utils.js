export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const addDexZeros = (dexNum) => {
  return dexNum.toString().padStart(3, '0');
};

export function chooseRandom(start, end) {
  const randomNum = Math.floor(Math.random() * (end - start + 1)) + start;
  return randomNum;
}