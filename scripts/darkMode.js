import * as filter from './filter.js' 

const navbar = document.querySelector('.navbar');
const footerAnchor = document.querySelectorAll('footer div a');

const darkModePreference = localStorage.getItem('darkMode');

if (darkModePreference === 'true') {
  filter.filterBtn.style.filter = 'invert(100%)';
  document.body.style.backgroundColor = '#171D25'; 
  document.body.style.color = 'white';
  document.querySelector('h1').style.color = 'white'
  navbar.style.backgroundColor = '#171D25';
  footerAnchor.forEach((anchor) => {
    anchor.style.color = 'white'
  });
  document.querySelectorAll('.navbar a').forEach((button) => {
    button.style.filter = 'invert(100%)';
  })
} else {
  document.body.style.backgroundColor = '#e6e6e6'; 
}