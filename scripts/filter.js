import  * as data_functions  from './data.js';
import  * as main from '../index.js' 

export const filterBtn = document.querySelector('.filter-icon-img');
const filterBox = document.querySelector('.filters-box');
const traitBtn = document.querySelectorAll('.trait-button');
const clearFilterBtn = document.querySelector('.clear-filter-button');
const regionSelectElem = document.querySelector('.regions-select');
const typeElems = document.querySelectorAll('.type-select')

export function changeRegion() {
  regionSelectElem.addEventListener('change', () => {
    main.fetchAll(data_functions.regions[regionSelectElem.value]).then(() => {filterCardsByTypeAndTrait()});
  })
}

filterBtn.addEventListener('click', () => {
  if (filterBox.style.display === 'none') {
    filterBox.style.display = 'flex'
    filterBtn.src = 'images/blue-filter.png'
  } else if (filterBox.style.display === 'flex') {
    filterBox.style.display = 'none'
    filterBtn.src = 'images/filter.png'
  }
});

let activatedTraits = new Set();

traitBtn.forEach((button) => {
  button.addEventListener('click', () => {
    const trait = button.id;

    if (!button.classList.contains('activated')) {
      button.classList.add('activated');
      button.style.borderColor = '#0084ff';
      button.style.color = '#0084ff';
      button.style.borderWidth = '1.8px';
      activatedTraits.add(trait)
    } else {
      button.classList.remove('activated');
      button.style.borderColor = '#808080f2';
      button.style.color = 'black';
      button.style.borderWidth = '1.7px';
      activatedTraits.delete(trait)
    }
    filterCardsByTypeAndTrait()
  })
})

typeElems.forEach((select) => {
  select.addEventListener('change', filterCardsByTypeAndTrait)
})

export function filterCardsByTypeAndTrait() {
  const cards = document.querySelectorAll('.pokemonCard');

  cards.forEach((card) => {
    const cardTrait = card.dataset.trait;
    const cardType1 = card.querySelector('.type-1').innerHTML.toLowerCase();
    const cardType2 = card.querySelector('.type-2').innerHTML.toLowerCase();
    const type1Select = document.querySelector('.type1').value.toLowerCase();
    const type2Select = document.querySelector('.type2').value.toLowerCase();

    const traitMatch = activatedTraits.size === 0 || activatedTraits.has(cardTrait);
    
    const typeMatch = 
      (type1Select === '' || cardType1 === type1Select || cardType2 === type1Select) &&
      (type2Select === '' || cardType1 === type2Select || cardType2 === type2Select);

    card.style.display = traitMatch && typeMatch ? 'flex' : 'none'

  })
}


clearFilterBtn.addEventListener('click', () => {
  typeElems.forEach((select) => {
    select.value = ''
  })

  traitBtn.forEach((button) => {
    button.classList.remove('activated');
    button.style.borderColor = '#808080f2';
    button.style.borderWidth = '1.7px';
    activatedTraits.clear()
  })

  regionSelectElem.value = 'all';
  main.fetchAll(data_functions.regions.all)

  filterCardsByTypeAndTrait()
}) 