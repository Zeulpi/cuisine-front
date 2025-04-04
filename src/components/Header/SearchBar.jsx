// src/components/SearchBar.jsx
import React, { useState } from 'react';
import './../../styles/Header/searchbar/search-bar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche pour:', searchQuery);
    // Tu peux ici appeler une fonction pour effectuer la recherche via ton API
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Chercher une recette"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Chercher</button>
      </form>
    </div>
  );
};

export default SearchBar;
