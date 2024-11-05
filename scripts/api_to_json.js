const fs = require('fs');

const pokemon = {};
const abilities = {};

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



async function makeObject() {
  for (i = 1; i <= 307; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${i}`);
    const data = await response.json();

    // console.log(data)


    abilities[`ability_${i}`] = {
     name: data.name,
     id: i
    };
  }

  fs.writeFile('./abilities.json', JSON.stringify(abilities, null, 2), (error) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Success!')
    }
  })
}

makeObject()