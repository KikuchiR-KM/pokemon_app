
import axios from 'axios';

/** ポケモンの取得 */
export const findPokemon = async (name) => {
  console.log("🚀 ~ file: pokemon.js:3 ~ findPokemon ~ name:", name);
  console.log(`https://pokeapi.co/api/v2/pokemon/${name}`)
  // const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  console.log("🚀 ~ file: pokemon.js:7 ~ findPokemon ~ response:", response)
  // const pokemon = await response.json();
  const pokemon = response.data;
  console.log("finePokemon out")
  return pokemon;
};
