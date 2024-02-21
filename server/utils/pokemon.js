
// import axios from 'axios';

/** ポケモンの取得 */
export const findPokemon = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  // const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  // const pokemon = response.data;
  return pokemon;
};
