export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const addDexZeros = (dexNum) => {
  return dexNum.toString().padStart(3, '0');
};

export function chooseRandom(start, end) {
  const randomNum = Math.floor(Math.random() * (end - start + 1)) + start;
  return randomNum;
};

export const createTypeImg = type => {
  const typeImg = document.createElement('img')
  typeImg.classList.add('type-image')
  typeImg.src = `images/types/${type}.png`
  document.querySelector('.types-box').appendChild(typeImg)
};

export const convertWeight = weight => {
  // hectograms to pounds
  const fixedWeight = (weight / 4.536).toFixed(1);
  return `${fixedWeight} lbs`
};

export const convertHeight = height => {
  // decimeters to feet/inches
  const inches = Math.round((height * 3.937))
  const feet = Math.floor(inches / 12)
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches}"`;
}

export const fixGenerationName = gen => {
  let words = gen.split('-');
  words[0] = capitalizeFirstLetter(words[0])
  words[1] = words[1].toUpperCase();
  let result = words.join(' ');
  return result;
}