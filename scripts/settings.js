// dark mode
const navbar = document.querySelector('.navbar');
const footerAnchor = document.querySelectorAll('footer div a');
const darkModeCheckbox = document.querySelector('.dark-mode-checkbox')
const settingTitle = document.querySelectorAll('.preference-title')
loadDarkModePreference()

darkModeCheckbox.addEventListener('change', () => {
  if (darkModeCheckbox.checked) {
    settingTitle.forEach((title) => {
      title.style.color = 'white'
    })
    document.body.style.backgroundColor = '#171D25';
    document.body.style.color = 'white';
    navbar.style.backgroundColor = '#171D25';
    footerAnchor.forEach((anchor) => {
      anchor.style.color = 'white'
    });
    navbar.querySelectorAll('.page-links-box a').forEach((a) => {
      a.style.color = 'white'
    })
    document.querySelectorAll('.buttons-box a').forEach((button) => {
      button.style.filter = 'invert(100%)';
    })
  } else {
    settingTitle.forEach((title) => {
      title.style.color = 'black'
    })
    document.body.style.backgroundColor = '#e6e6e6';
    document.body.style.color = 'black';
    navbar.style.backgroundColor = '#e6e6e6';
    navbar.querySelectorAll('.page-links-box a').forEach((a) => {
      a.style.color = 'black'
    })
    footerAnchor.forEach((a) => {
      a.style.color = 'black';
    })
    document.querySelectorAll('.buttons-box a').forEach((button) => {
      button.style.filter = 'invert(0%)';
    })
  }
  saveModePreference(darkModeCheckbox.checked);
});

const saveModePreference = (checkedOrNot) => {
  localStorage.setItem('darkMode', checkedOrNot)
}

function loadDarkModePreference() {
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference === 'true') {
      settingTitle.forEach((title) => {
        title.style.color = 'white'
      })
      document.body.style.backgroundColor = '#171D25'; 
      document.body.style.color = 'white';
      navbar.style.backgroundColor = '#171D25';
      footerAnchor.forEach((anchor) => {
        anchor.style.color = 'white'
      });
      navbar.querySelectorAll('.page-links-box a').forEach((a) => {
        a.style.color = 'white'
      })
      document.querySelectorAll('.buttons-box a').forEach((button) => {
        button.style.filter = 'invert(100%)';
      })
      if (darkModeCheckbox) {
          darkModeCheckbox.checked = true; 
      }
  } else {
      document.body.style.backgroundColor = '#e6e6e6'; 
      document.body.style.color = 'black';
  }
}

// Pokemon Name Languages

const radioButtons = document.getElementsByName('pokemon-language')

loadPokemonLanguagePreference()

let checkedLanguageIndex = ''

radioButtons.forEach((option) => {
  option.addEventListener('change', () => {
    if (option.checked) {
      checkedLanguageIndex = option.id
      savePokemonLanguagePreference(checkedLanguageIndex);
    }
  })
})

function savePokemonLanguagePreference(id) {
  localStorage.setItem('pokemonNameLanguage', id);
};

function loadPokemonLanguagePreference() {
  const pokemonLanguageValue = localStorage.getItem('pokemonNameLanguage');
  radioButtons.forEach((option) => {
    if (option.id === pokemonLanguageValue) {
      option.checked = true;
    }
  })
}


// clear cache settings

const cacheAll = document.querySelector('.cache-all');
const cachePreferences = document.querySelector('.cache-preferences');
const cachePokemon = document.querySelector('.cache-pokemon');

cacheAll.addEventListener('click', () => {
  let text = `Are you sure?<br>You will delete <strong>All</strong> local storage.`;
  
  Swal.fire({
    title: 'Warning',
    html: text, 
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No, cancel',
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#0084ff'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('darkMode');
      localStorage.removeItem('caughtPokemon');
      localStorage.removeItem('pokemonNameLanguage');
      location.reload()
    } else {
      console.log('Nope');
    }
  });
});

cachePokemon.addEventListener('click', () => {
  let text = `Are you sure?<br>You will delete all <strong>Pokémon</strong> local storage.`;
  
  Swal.fire({
    title: 'Warning',
    html: text, 
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No, cancel',
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#0084ff'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('caughtPokemon');
    } else {
      console.log('Nope');
    }
  });
});

cachePreferences.addEventListener('click', () => {
  let text = `Are you sure?<br>You will delete all <strong>Preference</strong> local storage.`;
  
  Swal.fire({
    title: 'Warning',
    html: text, 
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No, cancel',
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#0084ff'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('darkMode');
      localStorage.removeItem('pokemonNameLanguage');
      location.reload();
    } else {
      console.log('Nope');
    }
  });
});


//github icon

const githubElem = document.querySelector('.github-icon')

githubElem.addEventListener('mouseover', () => {
  githubElem.src = 'images/github.gif'
  githubElem.style.width = '42px';
  githubElem.style.marginRight = '-6px'
})

githubElem.addEventListener('mouseout', () => {
  githubElem.src = 'images/github.png'
  githubElem.style.width = '30px';
  githubElem.style.marginRight = '0px'
});