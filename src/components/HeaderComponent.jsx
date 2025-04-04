import React, { useState } from 'react';
import SearchBar from './Header/SearchBar';
import NavComponent from './Header/NavComponent';
import LoginComponent from './Header/LoginComponent';
import './../styles/Header/header.css';
import { useLocation } from 'react-router-dom';

const HeaderComponent = () => {
  return (
    <header className="header" id="site-header">
      {/* Section recherche */}
      <SearchBar />

      {/* Section navigation */}
      <NavComponent />

      {/* Section connexion */}
      <LoginComponent openLoginModal={location.state?.openLoginModal}
        prefillEmail={location.state?.prefillEmail} />
    </header>
  );
};

export default HeaderComponent;
