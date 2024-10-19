import  * as data_functions  from './scripts/data.js';
import  * as utils  from './scripts/utils.js' 


const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));


async function fetchPokemonInfo() {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  const response = await data.json();

  const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const speciesResponse = await speciesData.json();

  console.log(response)

  document.title = `Pokédex - ${utils.capitalizeFirstLetter(response.name)}`
  document.querySelector('.sprite-image').src = spriteURL.official.main;

  spriteHandling();
  populateBasicInfo(response.name, speciesResponse.generation.name)

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

const populateBasicInfo = (name, gen) => {
  const nameElem = document.querySelector('.pokemon-name');
  const introducedElem = document.querySelector('.introduced-text');
  const genName = fixGenerationName(gen);
  nameElem.innerHTML = utils.capitalizeFirstLetter(name);
  introducedElem.innerHTML = `Introduced in ${genName}`
}

const fixGenerationName = gen => {
  let words = gen.split('-');
  words[0] = utils.capitalizeFirstLetter(words[0])
  words[1] = words[1].toUpperCase();
  let result = words.join(' ');
  return result;
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


// loads next/last page pokemon
// function loadNextPokemon(direction) {
//   if (direction == 'next') {
//     window.open(`pokemon.html?id=${id + 1}`, '_self')
//   } else {
//     window.open(`pokemon.html?id=${id - 1}`, '_self')
//   } 
// }
