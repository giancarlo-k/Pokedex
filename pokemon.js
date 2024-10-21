import  * as data  from './scripts/data.js';
import  * as utils  from './scripts/utils.js' 


const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));


async function fetchPokemonInfo() {
  const mainData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const response = await mainData.json();
  const speciesResponse = await speciesData.json();





  const flavorObject = speciesResponse.flavor_text_entries

  // console.log(flavorObject[3].language)

  let flavorArray = [];

  for (let i = 0; i < flavorObject.length; i++) {
    if (flavorObject[i].language.name == 'en') {
      // remove weird random symbol thing 
      let fixedFlavorText = flavorObject[i].flavor_text.replace(/[^a-zA-Z0-9é\.\,\'\’\"\!\&\(\) ]/g, ' ')

      // change POKéMON from gen 1 to Pokémon
      if (/[A-Z]{3}é[A-Z]{3}/g.test(fixedFlavorText)) {
        fixedFlavorText = fixedFlavorText.replace(/[A-Z]{3}é[A-Z]{3}/g, 'Pokémon')
      } 

      // change capitalized pokemon names from gen 1 to normal
      if (/[A-Z]{2,}/g.test(fixedFlavorText)) {
        const capsMatch = fixedFlavorText.match(/[A-Z]{2,}/g);
        const fixedCaps = utils.capitalizeFirstLetter(capsMatch.join().toLowerCase())
        fixedFlavorText = fixedFlavorText.replace(capsMatch, fixedCaps)
      }

      if (!flavorArray.includes(fixedFlavorText)) {
        flavorArray.push(fixedFlavorText);
      }
    }
    // limit it to 5 descriptions (all in english!)
    if (flavorArray.length === 7) {
      break;
    }
  }

  flavorText(flavorArray)





  document.title = `Pokédex - ${utils.capitalizeFirstLetter(response.name)}`
  document.querySelector('.sprite-image').src = spriteURL.official.main;

  spriteHandling();
  populateBasicInfo(response.name, speciesResponse.generation.name);
  populateMeasurements(response.weight, response.height)
  getAndPopulateTypes(response)

}

fetchPokemonInfo()

const spriteURL = {
  gif: {
    main: `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`,
    shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/${id}.gif`
  },
  official: {
    main: `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${id}.png`,
    shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
  }
}

const getAndPopulateTypes =(response) => {
  const type1 = response.types[0].type.name;
  utils.createTypeImg(type1)

  if (response.types.length > 1) {
    const type2 = response.types[1].type.name;
    utils.createTypeImg(type2);
  }
}


const populateBasicInfo = (name, gen) => {
  const nameElem = document.querySelector('.pokemon-name');
  const introducedElem = document.querySelector('.introduced-text');
  const genName = utils.fixGenerationName(gen);
  nameElem.innerHTML = utils.capitalizeFirstLetter(name);
  introducedElem.innerHTML = `Introduced in ${genName}`
  document.querySelector('.dex-number').innerHTML = `#${utils.addDexZeros(id)}`
}

const spriteHandling = () => {
  const shinyIcon = document.querySelector('.shiny-icon');
  const gifIcon = document.querySelector('.gif-icon');

  gifIcon.addEventListener('click', () => {   
    const gifIconSrc = gifIcon.src.split('/').pop(); 
    if (gifIconSrc === 'gif.png') {
      // NORMAL GIF
      gifIcon.src = 'images/activated-gif.png';
      document.querySelector('.sprite-image').style.width = '190px'
      document.querySelector('.sprite-image').src = spriteURL.gif.main;
      shinyIcon.src = 'images/empty-sparkling.png';
    } else if (gifIconSrc === 'activated-gif.png') {
      // SHINY GIF
      gifIcon.src = 'images/activated-shiny-gif.png';
      document.querySelector('.sprite-image').src = spriteURL.gif.shiny;
      document.querySelector('.sprite-image').style.width = '190px'
      shinyIcon.src = 'images/empty-sparkling.png';
    } else if (gifIconSrc === 'activated-shiny-gif.png') {
      // NORMAL
      gifIcon.src = 'images/gif.png'
      document.querySelector('.sprite-image').src = spriteURL.official.main;
      shinyIcon.src = 'images/empty-sparkling.png';
      document.querySelector('.sprite-image').style.width = '230px'
    }
  })

  shinyIcon.addEventListener('click', () => {  
    const shinyIconSrc = shinyIcon.src.split('/').pop(); 
    if (shinyIconSrc === 'empty-sparkling.png') {
      // SHINY 
      shinyIcon.src = 'images/sparkling.png';
      document.querySelector('.sprite-image').src = spriteURL.official.shiny;
       gifIcon.src = 'images/gif.png'
    } else if (shinyIconSrc === 'sparkling.png') {
      // NORMAL 
      shinyIcon.src = 'images/empty-sparkling.png';
      document.querySelector('.sprite-image').src = spriteURL.official.main;
       gifIcon.src = 'images/gif.png'
    } 
  });

  // if its after Unova, hide the gif option
  if (id > 649) {
    gifIcon.style.display = 'none'
  };
}

const populateMeasurements = (weight, height) => {
  const heightElem = document.querySelector('.pokemon-height')
  const weightElem = document.querySelector('.pokemon-weight')
  const newHeight = utils.convertHeight(height);
  const newWeight = utils.convertWeight(weight);
  weightElem.innerHTML = newWeight;
  heightElem.innerHTML = newHeight;
}

// loads next/last page pokemon
// function loadNextPokemon(direction) {
//   if (direction == 'next') {
//     window.open(`pokemon.html?id=${id + 1}`, '_self')
//   } else {
//     window.open(`pokemon.html?id=${id - 1}`, '_self')
//   } 
// }


// flavor text 

function flavorText(array) {
  const textContainer = document.querySelector('.flavor-text-box')
  


  array.forEach((index) => {
    const buttonSpan = document.createElement('span')
    document.querySelector('.flavor-text-button-list').appendChild(buttonSpan)
  })

  const textSpans = document.querySelectorAll('.flavor-text-button-list span');
  
  let currentIndex = 0
  let interval;
  
  const loadNewText = index => {
    textContainer.innerHTML = array[index];
    textContainer.classList.remove('text-slide-in')
    void textContainer.offsetWidth; 
    textContainer.classList.add('text-slide-in');
    textSpans.forEach((span) => span.classList.remove('active')); 
    if (textSpans[currentIndex]) textSpans[currentIndex].classList.add('active');
    
  }
  
  const starFlavorTextCycle = () => {
    interval = setInterval (() => {
      currentIndex = (currentIndex + 1) % array.length
      loadNewText(currentIndex)
    }, 5000)
  }
  
  textSpans.forEach((span, index) => {
    span.addEventListener('click', () => {
      clearInterval(interval)
      currentIndex = index;
      loadNewText(currentIndex)
      starFlavorTextCycle()
    })
  })
  
  loadNewText(currentIndex)
  starFlavorTextCycle()
}

// regex

// make it so that you replace every chaarceet that isnt a-zA-Z0-9.!&?

//capitals -
// [A-Z]{2,}

//random symbol - 
// str.replace(/[^a-zA-Z0-9\.\,\'\"\!\&\(\) ]/g, ' ')

