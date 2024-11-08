import  * as utils  from './utils.js'; 

const generationContainers = document.querySelectorAll('.generation-ability-container')

async function fetchAbilities() {
  for (let i = 1; i <= 307; i++) {
    const abilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${i}`)
    const abilityData = await abilityResponse.json()

    // console.log(abilityData)

    const pokemonAmt = abilityData.pokemon.length;
    const abilityName = utils.fixDashedStrings(abilityData.name);
    const abilityID = abilityData.id
    let abilityDescription = '';
    if (abilityData.effect_entries.length === 0) {
      abilityDescription = abilityData.flavor_text_entries.find((entry) => entry.language.name === 'en').flavor_text;
    } else {
      abilityDescription = abilityData.effect_entries.find(
        (entry) => entry.language.name === 'en').short_effect;          
    }
    // console.log(abilityDescription)

    generationContainers.forEach((gen) => {
      let abilityHTML = '';
      // console.log(gen.id)
      if (gen.id == abilityData.generation.name) {
        abilityHTML = `
          <div id="ability-${abilityID}" class="ability">
            <div class="ability-name">${abilityName}</div>
            <div class="ability-pokemon-amt">‣ Found in <span>${pokemonAmt}</span> Pokémon</div>
            <div class="ability-description">‣ ${abilityDescription}</div>
          </div>
        `;
        gen.innerHTML += abilityHTML;
      }
      if (darkModePreference === 'true') {
        document.querySelectorAll('.ability').forEach((ability) => {
          ability.style.boxShadow = 'rgba(3, 3, 3, 0.4) 0px 7px 29px 0px';
        })
      }
    })
  }

  scrollToId();
}


function scrollToId() {
  const targetId = window.location.hash.substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    targetElement.querySelector('.ability-name').style.color = '#0084ff';
    targetElement.style.border = '2px solid #0084ff';
  }
}

  document.addEventListener("DOMContentLoaded", function() {
    fetchAbilities(); 
    populateDatalist()
  })
;


// search barx
const abilitySearchbarElem = document.querySelector('#ability-searchbar');
const abilitySearchBtn = document.querySelector('#ability-search-button');
const clearSearchBtn = document.querySelector('.clear-search-button')

abilitySearchbarElem.addEventListener('input', () => {
  if (abilitySearchbarElem.value) {
    clearSearchBtn.style.display = 'flex';
  } else {
    clearSearchBtn.style.display = 'none';
  }
})

clearSearchBtn.addEventListener('click', () => {
  abilitySearchbarElem.value = '';
  clearSearchBtn.style.display = 'none';
})

abilitySearchBtn.addEventListener('click', () => {
  const targetId = `ability-${abilitySearchbarElem.value.split('-')[0].trim()}`;
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
     targetElement.querySelector('.ability-name').style.color = '#0084ff';
     targetElement.style.border = '2px solid #0084ff';
  }
})

async function populateDatalist() {
  const response = await fetch('./data/abilities.json');
  const data = await response.json();
  const datalistElem = document.querySelector('#ability-datalist');
  let datalistHTML = '';

  Object.values(data).forEach((value) => {
    datalistHTML += `<option value="${value.id} - ${utils.fixDashedStrings(value.name)}"></option>`
  })

  datalistElem.innerHTML = datalistHTML;
}

populateDatalist();

// Dark mode

const navbar = document.querySelector('.navbar');
const footerAnchor = document.querySelectorAll('footer div a');

const darkModePreference = localStorage.getItem('darkMode');

console.log(darkModePreference)

if (darkModePreference === 'true') {

  document.querySelector('body').style.background = '#171D25';
  document.querySelector('*').style.color = 'white';
  document.querySelectorAll('.gen-name-underline').forEach((line) => {
    line.style.backgroundColor = 'white'
  })
  document.querySelectorAll('.other').forEach((section) => {
    section.style.borderTopColor = 'white';
  })
  navbar.style.backgroundColor = '#171D25';
  footerAnchor.forEach((anchor) => {
    anchor.style.color = 'white'
  });
  document.querySelectorAll('.navbar a').forEach((button) => {
    button.style.filter = 'invert(100%)';
  })
}