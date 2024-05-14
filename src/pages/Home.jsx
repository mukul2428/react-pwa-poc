import React, { useEffect, useState } from "react";

const Home = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [newPokemon, setNewPokemon] = useState({
    name: "",
    type: "",
    level: "",
    ability: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    // Load data from cache when component mounts
    if ("caches" in window) {
      caches.open("pokemonData").then((cache) => {
        cache.match("pokemonData").then((response) => {
          if (response) {
            response.json().then((data) => {
              setPokemonData(data);
            });
          }
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPokemon({ ...newPokemon, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPokemonData = [...pokemonData, newPokemon];
    setPokemonData(updatedPokemonData);
    setNewPokemon({
      name: "",
      type: "",
      level: "",
      ability: "",
      weight: "",
      height: "",
    });

    // Update cache with new data
    if ("caches" in window) {
      caches.open("pokemonData").then((cache) => {
        cache.put(
          "pokemonData",
          new Response(JSON.stringify(updatedPokemonData))
        );
      });
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "600px", margin: "0 auto", marginTop: "50px" }}
    >
      <h3 className="text-center mt-3">Pokemon Form</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={newPokemon.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Type:
          </label>
          <input
            type="text"
            id="type"
            name="type"
            className="form-control"
            value={newPokemon.type}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="level" className="form-label">
            Level:
          </label>
          <input
            type="number"
            id="level"
            name="level"
            className="form-control"
            value={newPokemon.level}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="ability" className="form-label">
            Ability:
          </label>
          <input
            type="text"
            id="ability"
            name="ability"
            className="form-control"
            value={newPokemon.ability}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">
            Weight:
          </label>
          <input
            type="text"
            id="weight"
            name="weight"
            className="form-control"
            value={newPokemon.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="height" className="form-label">
            Height:
          </label>
          <input
            type="text"
            id="height"
            name="height"
            className="form-control"
            value={newPokemon.height}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {pokemonData.length > 0 && (
        <div className="submitted-data mt-4">
          <h3>Submitted Data:</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Level</th>
                <th>Ability</th>
                <th>Weight</th>
                <th>Height</th>
              </tr>
            </thead>
            <tbody>
              {pokemonData.map((pokemon, index) => (
                <tr key={index}>
                  <td>{pokemon.name}</td>
                  <td>{pokemon.type}</td>
                  <td>{pokemon.level}</td>
                  <td>{pokemon.ability}</td>
                  <td>{pokemon.weight}</td>
                  <td>{pokemon.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
