const URL = `https://pokeapi.co/api/v2/pokemon?limit=151`;

export const getAllPokemonList = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return null;
  }
};
