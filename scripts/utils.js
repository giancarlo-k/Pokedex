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

export const fixDashedStrings = str => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function eeveeEvo(id) {

  const doubleEvoTriggerElem = document.querySelector('.level-up-trigger-box span');
  if (id === 133) {
    // Eeveelutions
    document.querySelector('.second img').src = 'images/question.png'
    document.querySelector('.second div').innerHTML = 'Multiple'    
    doubleEvoTriggerElem.innerHTML = ''
  } else if (id === 134) {
    doubleEvoTriggerElem.innerHTML = 'Water Stone'
  } else if (id === 135) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/135.png'
    document.querySelector('.second div').innerHTML = 'Jolteon'    
    doubleEvoTriggerElem.innerHTML = 'Thunder Stone'
  } else if (id === 136) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/136.png'
    document.querySelector('.second div').innerHTML = 'Flareon'    
    doubleEvoTriggerElem.innerHTML = 'Fire Stone'
  } else if (id === 196) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/196.png'
    document.querySelector('.second div').innerHTML = 'Espeon'    
    doubleEvoTriggerElem.innerHTML = 'Sun Stone'
  } else if (id === 197) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/197.png'
    document.querySelector('.second div').innerHTML = 'Umbreon'    
    doubleEvoTriggerElem.innerHTML = 'Moon Stone'
  } else if (id === 470) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/470.png'
    document.querySelector('.second div').innerHTML = 'Leafeon'    
    doubleEvoTriggerElem.innerHTML = 'Leaf Stone'
  } else if (id === 471) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/471.png'
    document.querySelector('.second div').innerHTML = 'Glaceon'    
    doubleEvoTriggerElem.innerHTML = 'Ice Stone'
  } else if (id === 700) {
    document.querySelector('.second img').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/700.png'
    document.querySelector('.second div').innerHTML = 'Sylveon'    
    doubleEvoTriggerElem.innerHTML = 'Shiny Stone'
  }
}