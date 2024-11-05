import  * as data_functions  from './scripts/data.js';
import  * as utils  from './scripts/utils.js' 
import  * as filter  from './scripts/filter.js' 

const input = document.getElementById('pokemon-name');
const pokeballBtn = document.querySelector('.pokeball-button');
const goldPokeballImg = document.querySelector('.gold-pokeball-icon');
const pokeballImg = document.querySelector('.normal-pokeball-icon');
const starIconImg = document.querySelector('.star-icon');
const amountCaughtElem = document.querySelector('.region-pokemon-caught');
const totalRegionAmountElem = document.querySelector('.total-region-pokemon');

const getCaughtState = () => {
  const caughtState = JSON.parse(localStorage.getItem('caughtPokemon')) || {};
  return caughtState;
}

const saveCaughtState = (id, caught) => {
  const caughtState = getCaughtState();
  caughtState[id.substring(1).trim()] = caught;
  localStorage.setItem('caughtPokemon', JSON.stringify(caughtState));
};

input.addEventListener('input', (event) => {
  showPokemonCard(event.target.value);
});

const pokemonNameLanguagePreference = Number(localStorage.getItem('pokemonNameLanguage'));


// DISPLAY ALL POKEMON
const allPokemonContainer = document.querySelector('.allPokemonContainer');

export async function fetchAll(region) {
    
  let allHTML = '';

  const start = region.start;
  const end = region.end;

  totalRegionAmountElem.innerHTML = (end - start) + 1

  const response = await fetch('./pokemon.json');
  const data = await response.json();

  for (let i = start; i <= end; i++) {

    let pokemonName = data[`pokemon_${i}`].names[pokemonNameLanguagePreference];

    const id = utils.addDexZeros(i);
    const type1 = data[`pokemon_${i}`].type1;
    let type2 = data[`pokemon_${i}`].type2;
    let typeClass = 'single';
    if (type2) {
      typeClass = 'dual';
    } else {
      type2 = ''
    }

    const caughtState = getCaughtState();
    const isCaught = caughtState[id] ? '' : 'notCaught';

    allHTML += `
    <a class="card-anchor" href="pokemon.html?id=${i}">     
      <div class="pokemonCard" style="border-color:  ${data_functions.typeColors[type1]}; background-color:  ${data_functions.typeColors[type1]}40;">
      <img src="./images/pokeball.png" class="caught ${isCaught}">

        <div style="display: none" class="icon starter-icon"><img src="./images/starter.png">
          <span class="tooltip-text" >Starter</span>
        </div>

        <div style="display: none" class="icon legendary-icon"><img src="./images/gold-pokeball.png">
          <span class="tooltip-text">Legendary</span>
        </div>

        <div style="display: none" class="icon sub-legendary-icon"><img src="./images/gold-pokeball.png">
          <span class="tooltip-text">Sub-Legendary</span>
        </div>

        <div style="display: none" class="icon mythical-icon"><img src="./images/purple-pokeball.png">
          <span class="tooltip-text">Mythical</span>
        </div>

        
        <div class="pokemon-card-name-box">
          <span class="pokemon-card-name">${pokemonName}</span>
          <span class="pokemon-card-id">#${id}</span>
        </div>
        <img class="pokemon-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${i}.png">
        <div class='eachTypeBox ${typeClass}'>
          <div class="type-1" style="background-color: ${data_functions.typeColors[type1]}">${utils.capitalizeFirstLetter(type1)}</div>
          <div class="type-2"  style="background-color: ${data_functions.typeColors[type2]}">${utils.capitalizeFirstLetter(type2)}</div>
        </div>
      </div>
    </a>
    `;      
  }


  allPokemonContainer.innerHTML = allHTML;

  filter.filterCardsByTypeAndTrait()

  // CAUGHT OR NOT
  
  const cards = document.querySelectorAll('.pokemonCard')
  let caughtCount = 0; 

  cards.forEach((card) => {

    const caughtElem = card.querySelector('.caught');
    const cardID = card.querySelector('.pokemon-card-id').innerHTML;


    checkPokemonCategory(card, cardID)


    if (!caughtElem.classList.contains('notCaught')) {
      caughtCount++; 
    }

    caughtElem.addEventListener('click', () => {
      caughtElem.classList.toggle('notCaught')

      const isCaught = !caughtElem.classList.contains('notCaught');
      if (isCaught) {
        caughtCount++;
        amountCaughtElem.innerHTML++;
      } else {
        caughtCount--;
        amountCaughtElem.innerHTML--;
      }

      if (amountCaughtElem.innerHTML == (end - start) + 1 ) {
        starIconImg.style.display = 'flex';
        goldPokeballImg.style.display = 'flex';
        pokeballImg.style.display = 'none';
      } else if (end === 649 && amountCaughtElem.innerHTML == 155) {
        starIconImg.style.display = 'flex';
        goldPokeballImg.style.display = 'flex';
        pokeballImg.style.display = 'none';
      } else {
        pokeballImg.style.display = 'flex';
        starIconImg.style.display = 'none';
        goldPokeballImg.style.display = 'none';
      }

      saveCaughtState(cardID, isCaught)
    })
  })

  amountCaughtElem.innerHTML = caughtCount; 
  if (caughtCount === (end - start) + 1) {
    starIconImg.style.display = 'flex';
    goldPokeballImg.style.display = 'flex';
    pokeballImg.style.display = 'none';
  } else if (end === 649 && amountCaughtElem.innerHTML == 155) {
    starIconImg.style.display = 'flex';
    goldPokeballImg.style.display = 'flex';
    pokeballImg.style.display = 'none';
  } else {
    pokeballImg.style.display = 'flex';
    starIconImg.style.display = 'none';
    goldPokeballImg.style.display = 'none';
  }

  pokeballBtn.addEventListener('click', () => {
    const randomPokemon = utils.chooseRandom(start, end)
    input.value = randomPokemon;
    showPokemonCard(randomPokemon);
  })

  const cardAnchor = document.querySelectorAll('.card-anchor')
  const darkModePreference = localStorage.getItem('darkMode');

  if (darkModePreference === 'true') {
    document.querySelector('.vanilla-span').style.color = 'white';
    document.querySelector('.vanilla-span a').style.color = 'white';
    document.querySelector('.vanilla-span a').addEventListener('mouseover', () => {
      document.querySelector('.vanilla-span a').style.color = '#0084ff';
    })
    document.querySelector('.vanilla-span a').addEventListener('mouseout', () => {
      document.querySelector('.vanilla-span a').style.color = 'white';
    })
    cardAnchor.forEach((anchor) => {
      anchor.style.color = 'white'
    });
  }

  cardAnchor.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      if (e.target.classList.contains('caught')) {
        e.preventDefault()
      }
    })
  })

};

const showPokemonCard = (input) => {
  const cardElements = document.querySelectorAll('.pokemonCard')

  cardElements.forEach((card) => {
    const cardId = Number(card.querySelector('.pokemon-card-id').innerHTML.substring(1));
    const cardName = card.querySelector('.pokemon-card-name').innerHTML.toLowerCase()

    if (cardId === Number(input) || cardName.includes(input)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none'
    }
  })
}


function checkPokemonCategory(card, id) {

  const withoutHash = id.substring(1).trim();
  const withoutZeros = parseInt(withoutHash, 10); 

  if (data_functions.starters.includes(withoutZeros)) {
    card.querySelector('.starter-icon').style.display = 'flex';
    card.dataset.trait = "starter";
  } else if (data_functions.legendaries.includes(withoutZeros)) {
    card.querySelector('.legendary-icon').style.display = 'flex';
    card.dataset.trait = "legendary";
  } else if (data_functions.subLegendaries.includes(withoutZeros)) {
    card.querySelector('.sub-legendary-icon').style.display = 'flex';
    card.dataset.trait = "sub";
  } else if (data_functions.mythicals.includes(withoutZeros)) {
    card.querySelector('.mythical-icon').style.display = 'flex';
    card.dataset.trait = "mythical";
  }
}

//github icon

const githubElem = document.querySelector('.github-icon')

githubElem.addEventListener('mouseover', () => {
  githubElem.src = './images/github.gif'
  githubElem.style.width = '42px';
  githubElem.style.marginRight = '-6px'
})

githubElem.addEventListener('mouseout', () => {
  githubElem.src = './images/github.png'
  githubElem.style.width = '30px';
  githubElem.style.marginRight = '0px'
});

filter.changeRegion();
fetchAll(data_functions.regions.all);

// scroll buttons

const scrollToBottomBtn = document.querySelector('.scroll-to-bottom-button');
const scrollToTopBtn = document.querySelector('.scroll-to-top-button');

window.addEventListener('scroll', () => {
  if (window.scrollY > 625 && window.scrollY < 40200) {
    scrollToBottomBtn.style.display = 'block';
  } else {
    scrollToBottomBtn.style.display = 'none';
  }

  if (window.scrollY > 625) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
})

scrollToBottomBtn.addEventListener('click', () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
})

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})