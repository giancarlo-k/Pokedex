import  * as data from './scripts/data.js';
import  * as utils  from './scripts/utils.js' 


const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

async function fetchPokemonInfo() {
  const mainData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const response = await mainData.json();
  const speciesResponse = await speciesData.json();

  // flavor text (descriptions)

  const flavorObject = speciesResponse.flavor_text_entries

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
    // limit it to 7 descriptions (all in english!)
    if (flavorArray.length === 7) {
      break;
    }
  }

  // abilities
  populateAbilities(response)

  if (/.+-.+/g.test(response.name)) {
    document.title = `Pokédex - ${utils.fixDashedStrings(response.name)}`;
  } else {
    document.title = `Pokédex - ${utils.capitalizeFirstLetter(response.name)}`;
  }

  document.querySelector('.sprite-image').src = spriteURL.official.main;

  // Population
  spriteHandling();
  populateBasicInfo(response.name, speciesResponse.generation.name);
  populateMeasurements(response.weight, response.height);
  getAndPopulateTypes(response);
  flavorText(flavorArray);
  populateStats(response);
  populateGender(speciesResponse);
  populateLeveling(speciesResponse);
  populateMisc(speciesResponse);
  populateEvolutionLine(speciesResponse);
  populateMoves(response)

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

  //fix dashed names
  if (/.+-.+/g.test(name) && !data.dashOutliers.includes(id)) {
    nameElem.innerHTML = utils.fixDashedStrings(name)
  } else {
    nameElem.innerHTML = utils.capitalizeFirstLetter(name);    
  }

  // outliers
  if (id === 122) {
    nameElem.innerHTML = 'Mr. Mime';    
  } else if (id === 439) {
    nameElem.innerHTML = 'Mime Jr.';
  } else if (id === 866) {
    nameElem.innerHTML = 'Mr. Rime';
  }

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
    }, 4700)
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

// previous/next pokemon
const nextOrPreviousElem = document.querySelector('.next-previous-box')

if (id === 1) {
  nextOrPreviousElem.querySelector('.previous').style.display = 'none';
  nextOrPreviousElem.style.justifyContent = 'flex-end';
} else if (id === 1025) {
  nextOrPreviousElem.querySelector('.next').style.display = 'none';
}

nextOrPreviousElem.addEventListener('click', event => {
  const selectedButton = event.target.id;
  loadNextPokemon(selectedButton)
})

function loadNextPokemon(direction) {
  if (direction == 'next') {
    window.open(`pokemon.html?id=${id + 1}`, '_self')
  } else if (direction == 'previous') {
    window.open(`pokemon.html?id=${id - 1}`, '_self')
  } else {}
}

function populateNextPrevious(id) {
  const previousImage = document.querySelector('.previous-image');
  const previousId = document.querySelector('.previous-id');
  const nextImage = document.querySelector('.next-image');
  const nextId = document.querySelector('.next-id');

  previousId.innerHTML = `#${utils.addDexZeros(id - 1)}`;
  nextId.innerHTML = `#${utils.addDexZeros(id + 1)}`;

  previousImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id - 1}.png`;
  nextImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id + 1}.png`
}

populateNextPrevious(id)


// abilities 

function populateAbilities(res) {
  let abilityHTML = ''
  const seenAbilities = new Set();
  const abilityTextBoxElem = document.querySelector('.abilities-text-container');

  res.abilities.forEach((abilityObject) => {

    let abilityName = '';

    if (/.+-.+/g.test(abilityObject.ability.name)) {
      abilityName = utils.fixDashedStrings(abilityObject.ability.name)
    } else {
      abilityName = utils.capitalizeFirstLetter(abilityObject.ability.name);
    }

    if (seenAbilities.has(abilityName)) return;
    
    seenAbilities.add(abilityName);
    const abilityURL = abilityObject.ability.url;

    fetch(abilityURL)
      .then((response) => response.json())
      .then((abilityData) => {
        let abilityDescription = ''
        if (abilityData.effect_entries.length === 0) {
          abilityDescription = abilityData.flavor_text_entries.find((entry) => entry.language.name === 'en').flavor_text;
        } else {
          abilityDescription = abilityData.effect_entries.find(
            (entry) => entry.language.name === 'en').short_effect;          
        }
          abilityHTML += `
            <div class="ability">
              <div class="ability-name">
                ${abilityName}
                <div class="hidden-ability">
                  <img style="display: ${abilityObject.is_hidden ? 'flex' : 'none'}" width="20" src="images/hide.png">
                  <span class="tooltip-text">Hidden Ability</span>
                </div>
              </div>
              <div class="ability-description">${abilityDescription}</div>
            </div>
          `
          abilityTextBoxElem.innerHTML = abilityHTML
      })
  })
}

// Stats

function populateStats(res) {
  const barValues = document.querySelectorAll('.stat-value');
  const innerBarValues = document.querySelectorAll('.inner-bar');
  let total = 0;
  barValues.forEach((stat) => {
    switch(stat.id) {
      case('hp'):
        stat.innerHTML = res.stats[0].base_stat;
        total += res.stats[0].base_stat;
        break;
      case('attack'):
        stat.innerHTML = res.stats[1].base_stat;
        total += res.stats[1].base_stat;
        break;
      case('defense'):
        stat.innerHTML = res.stats[2].base_stat;
        total += res.stats[2].base_stat;
        break;
      case('spAttack'):
        stat.innerHTML = res.stats[3].base_stat;
        total += res.stats[3].base_stat;
        break;
      case('spDefense'):
        stat.innerHTML = res.stats[4].base_stat;
        total += res.stats[4].base_stat;
        break;
      case('speed'):
        stat.innerHTML = res.stats[5].base_stat;
        total += res.stats[5].base_stat;
        break;
      case('total'):
        stat.innerHTML = `<strong>${total}</strong>`;
        break;
    }
  })

  const calcBarWidth = num => {
    return (num / 255) * 100;
  }

  const calcTotalBarWidth = num => {
    return (num / 1530) * 100;
  }

  innerBarValues.forEach((bar) => {
    let type = res.types[0].type.name
    bar.style.backgroundColor = `${data.typeColors[type]}`
    switch(bar.id) {
      case('hp-bar'):
        bar.style.width = `${calcBarWidth(res.stats[0].base_stat)}%`
        break;
      case('attack-bar'):
        bar.style.width = `${calcBarWidth(res.stats[1].base_stat)}%`
        break;
      case('defense-bar'):
        bar.style.width = `${calcBarWidth(res.stats[2].base_stat)}%`
        break;
      case('spAttack-bar'):
        bar.style.width = `${calcBarWidth(res.stats[3].base_stat)}%`
        break;
      case('spDefense-bar'):
        bar.style.width = `${calcBarWidth(res.stats[4].base_stat)}%`
        break;
      case('speed-bar'):
        bar.style.width = `${calcBarWidth(res.stats[5].base_stat)}%`
        break;
      case('total-bar'):
        bar.style.width = `${calcTotalBarWidth(total)}%`
        bar.style.backgroundColor = '#303030'
        break;
    }
  })
}


// Evolutions
async function populateEvolutionLine(res) {
  const evolutionData = await fetch(res.evolution_chain.url)
  const evolutionResponse = await evolutionData.json();

  const evoElem = document.querySelector('.evolution-line-box') 

  // first evolution  
  const firstInLineData = await fetch(evolutionResponse.chain.species.url)
  const firstInLineResponse = await firstInLineData.json()
  const firstInLineName = utils.capitalizeFirstLetter(firstInLineResponse.name)
  const firstInLineId = firstInLineResponse.id;

  const doubleBranchedArray = [182, 199, 368, 475, 478, 792];

  // second evolution
  let secondInLineName = '';
  let secondInLineId = '';
  let thirdInLineName = '';
  let thirdInLineId = '';

  if (evolutionResponse.chain.evolves_to.length > 0 && id !== 489 && id !== 490 && evolutionResponse.chain.evolves_to[0].evolution_details.length != 0) {
    let secondInLineData = await fetch(evolutionResponse.chain.evolves_to[0].species.url)
       
    if (doubleBranchedArray.includes(id)) {
      secondInLineData = await fetch(evolutionResponse.chain.evolves_to[1].species.url)
    }
    
    const secondInLineResponse = await secondInLineData.json()

    secondInLineName = utils.capitalizeFirstLetter(secondInLineResponse.name)
    secondInLineId = secondInLineResponse.id;

    const evolutionTriggerName = evolutionResponse.chain.evolves_to[0].evolution_details[0].trigger.name;
    const evolutionTriggerPrefix = evolutionResponse.chain.evolves_to[0].evolution_details[0];

    if (id === 292) {
      secondInLineName = 'Shedinja';
      secondInLineId = 292
    } 

    evoElem.innerHTML = `
      <a class="evolution-anchor" href='./pokemon.html?id=${firstInLineId}'>
        <div class='evolution-pokemon-box'>
          <img width="50" src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${firstInLineId}.png">
          <div>${firstInLineName}</div>
        </div>
      </a>

      <div class='level-up-trigger-box'>
        <span></span>
        <img width="30" src="images/arrow-right-solid.svg">
      </div>

      <a class="evolution-anchor" href='./pokemon.html?id=${secondInLineId}'>
        <div class='evolution-pokemon-box second'>
          <img width="50" src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${secondInLineId}.png">
          <div>${secondInLineName}</div>
        </div>
      </a>
    `;

    const doubleEvoTriggerElem = document.querySelector('.level-up-trigger-box span');
    const firstLevelBenchmark = evolutionTriggerPrefix.min_level;
    // console.log(firstLevelBenchmark)

    switch (evolutionTriggerName) {
      case('level-up'):

        doubleEvoTriggerElem.innerHTML = `Level ${firstLevelBenchmark}`

        if (
          !evolutionTriggerPrefix.min_level && evolutionTriggerPrefix.known_move
        ) {
          doubleEvoTriggerElem.innerHTML = `Know ${utils.fixDashedStrings(evolutionTriggerPrefix.known_move.name)}`
        } else if (evolutionTriggerPrefix.min_happiness) {
          // Happiness
          doubleEvoTriggerElem.innerHTML = `${evolutionTriggerPrefix.min_happiness} Happiness`
        } else if (evolutionTriggerPrefix.party_species) {
          // Specific Pokémon in party
          doubleEvoTriggerElem.innerHTML = `${utils.fixDashedStrings(evolutionTriggerPrefix.party_species.name)} in Party`
        } else if (evolutionTriggerPrefix.held_item) {
          // Held Item
          doubleEvoTriggerElem.innerHTML = `Holding ${utils.fixDashedStrings(evolutionTriggerPrefix.held_item.name)}`
        } else if (evolutionTriggerPrefix.location) {
            // Location
            doubleEvoTriggerElem.innerHTML = `At ${utils.fixDashedStrings(evolutionTriggerPrefix.location.name)}`
        } else if (evolutionTriggerPrefix.min_beauty) {
          // Beauty
          doubleEvoTriggerElem.innerHTML = `${evolutionTriggerPrefix.min_beauty} Beauty`
        }
        break;
      case('trade'):
        doubleEvoTriggerElem.innerHTML = 'Trade';
        break;
      case('use-item'):
        doubleEvoTriggerElem.innerHTML = `${utils.fixDashedStrings(evolutionTriggerPrefix.item.name)}`;
        break;
      default:
         doubleEvoTriggerElem.innerHTML = '';
    }

    utils.eeveeEvo(id);


    // 3 pokemon 
    if (evolutionResponse.chain.evolves_to[0].evolves_to.length > 0) {
      evoElem.style.width = '110%'
      let secondLevelBenchmark = evolutionResponse.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level;
      // console.log(secondLevelBenchmark)

        let thirdInLineURL = '';

        

        if (doubleBranchedArray.includes(id)) {
          thirdInLineURL = evolutionResponse.chain.evolves_to[0].evolves_to[1].species.url;
          secondLevelBenchmark = evolutionResponse.chain.evolves_to[0].evolves_to[1].evolution_details[0].min_level;
        } else {
          thirdInLineURL = evolutionResponse.chain.evolves_to[0].evolves_to[0].species.url;
        }

        let thirdInLineData = await fetch(thirdInLineURL);
        let thirdInLineResponse = await thirdInLineData.json();

        thirdInLineName = utils.capitalizeFirstLetter(thirdInLineResponse.name);
        thirdInLineId = thirdInLineResponse.id;

        

        evoElem.innerHTML = `
          <a class="evolution-anchor" href='./pokemon.html?id=${firstInLineId}'>
            <div class='evolution-pokemon-box'>
              <img width="50" src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${firstInLineId}.png">
              <div>${utils.fixDashedStrings(firstInLineName)}</div>
            </div>
          </a>

          <div class='level-up-trigger-box first-arrow'>
            <span></span>
            <img width="30" src="images/arrow-right-solid.svg">
          </div>

          <a class="evolution-anchor" href='./pokemon.html?id=${secondInLineId}'>
            <div class='evolution-pokemon-box second'>
              <img width="50" src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${secondInLineId}.png">
              <div>${secondInLineName}</div>
            </div>
          </a>

          <div class='level-up-trigger-box second-arrow'>
            <span></span>
            <img width="30" src="images/arrow-right-solid.svg">
          </div>

          <a class="evolution-anchor" href='./pokemon.html?id=${thirdInLineId}'>
            <div class='evolution-pokemon-box third'>
              <img width="50" src="https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/pokemon/other/official-artwork/${thirdInLineId}.png">
              <div>${thirdInLineName}</div>
            </div>
          </a>
        `; 

        const tripleFirstEvolutionTriggerElem = document.querySelector('.first-arrow span')
        const tripleSecondEvolutionTriggerElem = document.querySelector('.second-arrow span')
        let secondEvolutionTriggerName = evolutionResponse.chain.evolves_to[0].evolves_to[0].evolution_details[0].trigger.name;
        let secondEvolutionPrefix =  evolutionResponse.chain.evolves_to[0].evolves_to[0].evolution_details[0];

        if (doubleBranchedArray.includes(id)) {
          secondEvolutionTriggerName = evolutionResponse.chain.evolves_to[0].evolves_to[1].evolution_details[0].trigger.name;
          secondEvolutionPrefix =  evolutionResponse.chain.evolves_to[0].evolves_to[1].evolution_details[0];
        }


        switch(evolutionTriggerName) {
          case('level-up'):
            tripleFirstEvolutionTriggerElem.innerHTML = `Level ${firstLevelBenchmark}`;  

            if (evolutionTriggerPrefix.held_item) {
              tripleFirstEvolutionTriggerElem.innerHTML = utils.fixDashedStrings(evolutionTriggerPrefix.held_item.name);
            } else if (evolutionTriggerPrefix.min_happiness) {
              tripleFirstEvolutionTriggerElem.innerHTML = `${evolutionTriggerPrefix.min_happiness} Happiness`
           }
            break;
          case('trade'):
          tripleFirstEvolutionTriggerElem.innerHTML = 'Trade';  
        }

        switch(secondEvolutionTriggerName) {
          case('level-up'):
            tripleSecondEvolutionTriggerElem.innerHTML = `Level ${secondLevelBenchmark}`

            if (secondEvolutionPrefix.location) {
              tripleSecondEvolutionTriggerElem.innerHTML = `At ${utils.fixDashedStrings(secondEvolutionPrefix.location.name)}`
            } else if (secondEvolutionPrefix.min_happiness) {
               tripleSecondEvolutionTriggerElem.innerHTML = `${secondEvolutionPrefix.min_happiness} Happiness`
            } 
            break;
          case('trade'):
            tripleSecondEvolutionTriggerElem.innerHTML = 'Trade';
            break;
          case('use-item'):
          tripleSecondEvolutionTriggerElem.innerHTML = utils.fixDashedStrings(secondEvolutionPrefix.item.name);
        }
    }

  } 
   else {
    evoElem.innerHTML = ` <div class="na-box">N/A</div>`
  }
  
}

// Leveling
async function populateLeveling(res) {
  const growthRateElem = document.querySelector('.growth-rate-box span strong')
  const totalXpElem = document.querySelector('.total-xp-box span strong')

  const growthRateURL = res.growth_rate.url;
  const growthRateData = await fetch(growthRateURL);
  const growthRateResponse = await growthRateData.json();

  growthRateElem.innerHTML = utils.fixDashedStrings(res.growth_rate.name)
  
  if (res.growth_rate.name === 'fast-then-very-slow') {
    growthRateElem.innerHTML = 'Fast Then Slow';
  } else if (res.growth_rate.name === 'slow-then-very-fast') {
    growthRateElem.innerHTML = 'Slow Then Fast';
  }

  const totalXpAmt = growthRateResponse.levels[99].experience

  totalXpElem.innerHTML = `${totalXpAmt.toLocaleString()}`

}

// Gender
function populateGender(res) {
  const femaleRate = (res.gender_rate / 8) * 100;
  const maleRate = 100 - femaleRate

  const genderElem = document.querySelector('.gender-info-container');

  if(res.gender_rate === -1) {
    genderElem.innerHTML = `
      <div class="genderless">
        Genderless
      </div>
    `;
  } else {   
      genderElem.innerHTML = `
        <div class="gender-stat-box">
          <img src="images/male.png" width="25">
          ${maleRate}%
        </div>
        <div class="gender-stat-box">
          <img src="images/female.png" width="25">
          ${femaleRate}%
        </div>
      `;
  }
}

// Misc.
function populateMisc(res) {
  const habitatElem = document.querySelector('.habitat');
  const captureRateElem = document.querySelector('.capture-rate');
  const baseHappinessElem = document.querySelector('.base-happiness');
  const eggGroupElem = document.querySelector('.egg-group');

  let habitatName = 'N/A';

  if (res.habitat) {
    habitatName = utils.fixDashedStrings(res.habitat.name);
  }

  const eggGroupsArray = res.egg_groups;


  let eggGroupNames = [];

  if (eggGroupsArray.length == 0) {
    eggGroupElem.innerHTML = 'N/A';
  } else {
    eggGroupsArray.forEach((group) => {
      const eggGroupName = utils.fixDashedStrings(group.name);
      eggGroupNames.push(eggGroupName);
    })

    if (eggGroupsArray.length > 1) {
      eggGroupElem.parentElement.querySelector('div:first-of-type').innerHTML = 'Egg Groups';
    }

    eggGroupElem.innerHTML = eggGroupNames.join(' & ');
  }

  habitatElem.innerHTML = habitatName;
  captureRateElem.innerHTML = `${parseFloat(((res.capture_rate / 255) * 100).toFixed(2))}%`
  baseHappinessElem.innerHTML = `${parseFloat(((res.base_happiness / 255) * 100).toFixed(2))}%`
}

// Moves
function populateMoves(res) {

  const movesElem = document.querySelector('.moves-tbody')

  const amountOfMoves = res.moves.length;
  const amountOfMovesElem = document.querySelector('.moves-container span')

  amountOfMovesElem.innerHTML = `Moves (${amountOfMoves} Total)`

  let movesHTML = '';

  async function fetchMoves(res) {
    for (const moveObject of res.moves) {
      const moveData = await fetch(moveObject.move.url);
      const moveResponse = await moveData.json();
      
      const moveName = utils.fixDashedStrings(moveObject.move.name);
      const moveType = utils.capitalizeFirstLetter(moveResponse.type.name)
      let movePower = '-'
      if (moveResponse.power) {
        movePower = moveResponse.power;
      };
      let moveAccuracy = '-';
      if (moveResponse.accuracy) {
        moveAccuracy = moveResponse.accuracy;
      } 
      const movePP = moveResponse.pp;


      movesHTML += `
        <tr>
          <th class="name-th">${moveName}</th>
          <th class="type-th">
            <div class="move-type-container">
              <div style="background-color: ${data.typeColors[moveType.toLowerCase()]};" class="move-type-div"></div>
              ${moveType}
            </div>
          </th>
          <th class="power-th">${movePower}</th>
          <th class="acc-th">${moveAccuracy}</th>
          <th class="pp-th">${movePP}</th>
        </tr>
      `;
    }

    movesElem.innerHTML = movesHTML
  }

  fetchMoves(res)
}