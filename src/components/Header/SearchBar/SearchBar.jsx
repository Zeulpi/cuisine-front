// src/components/SearchBar.jsx
import React, { useState, useRef } from 'react';
import '../../../styles/Header/searchbar/search-bar.css';
import { useNavigate } from 'react-router';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
  
    navigate('/recipes', {
      state: {
        fastSearch: searchQuery.trim(),
        nonce: Date.now(),
      },
    });
  
    e.target.reset(); // reset le formulaire
    setSearchQuery(''); // reset le state
    inputRef.current?.blur(); // retire le focus de l'input
  };
  

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Recherche rapide..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          ref={inputRef}
        />
        <button type="submit"><span>⇨</span></button>
      </form>
    </div>
  );
};

export default SearchBar;
