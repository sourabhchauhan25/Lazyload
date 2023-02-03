
import React, { useState, useEffect } from "react";
import axios from "axios";

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  let lim = 50;

  useEffect(() => {
    fetchPokemonData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let scrollHeight = document.body.scrollHeight;
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
  
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("Reached end of page");
        console.log(pokemonData.length);
        lim = lim + 50;
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const fetchPokemonData = async (url = POKEMON_API) => {
    setLoading(true);
    const response = await axios.get(`${url}?offset=${currentPage * 50}&limit=${lim}`);
    setPokemonData(response.data.results);
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    fetchPokemonData(`${POKEMON_API}?offset=${currentPage * 50}&limit=${lim}`);
  };

  const filteredPokemonData = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a Pokemon"
        onChange={handleSearch}
      />
      {loading && <p>Loading...</p>}
      <ul>
        {filteredPokemonData.map((pokemon, index) => (
          <li key={index}>{pokemon.name}</li>
        ))}
      </ul>
      {pokemonData.length > 0 && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
    </div>
  );
}

export default App;

