const fs = require('fs');

const pokemon = {};
const abilities = {};
const moves = {};

// async function makeObject() {
//   for (i = 1; i <= 1025; i++) {
//     const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
//     const data = await response.json();
    
//     const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
//     const speciesData = await speciesResponse.json();


//     pokemon[`pokemon_${i}`] = {
//      names: [
//       speciesData.names[8].name,
//       speciesData.names[0].name,
//       speciesData.names[2].name,
//       speciesData.names[3].name,
//       speciesData.names[4].name,
//       speciesData.names[6].name,
//       speciesData.names[5].name
//     ],
//      type1: data.types[0].type.name,
//      type2: data.types[1] ?  data.types[1].type.name : null
//     };
//   }

//   fs.writeFile('./pokemon.json', JSON.stringify(pokemon, null, 2), (error) => {
//     if (error) {
//       console.log(error)
//     } else {
//       console.log('Success!')
//     }
//   })
// }

// Abilities

// async function makeObject() {
//   for (i = 1; i <= 307; i++) {
//     const response = await fetch(`https://pokeapi.co/api/v2/ability/${i}`);
//     const data = await response.json();

//     // console.log(data)


//     abilities[`ability_${i}`] = {
//      name: data.name,
//      id: i
//     };
//   }

//   fs.writeFile('./abilities.json', JSON.stringify(abilities, null, 2), (error) => {
//     if (error) {
//       console.log(error)
//     } else {
//       console.log('Success!')
//     }
//   })
// }

// makeObject()

async function makeObject() {
  for (let i = 1; i <= 919; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${i}`);
    const data = await response.json();

    let power = data.power;
    let description = data.flavor_text_entries.find(item => item.language.name == 'en')?.flavor_text;


    if (description === 'Dummy Data' || data.flavor_text_entries.length === 0) {
      description = 'N/A'
    }

    if (power === null) {
      power = '-'
    }

    moves[`move_${i}`] = {
     name: data.name,
     id: i,
     type: data.type.name,
     generation: data.generation.name,
     pp: data.pp,
     accuracy: data.accuracy,
     learned: data.learned_by_pokemon.length,
     power,
     description
    };
  }

  fs.writeFile('./moves.json', JSON.stringify(moves, null, 2), (error) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Success!')
    }
  })
}

makeObject()