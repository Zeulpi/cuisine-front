import React, { useState } from 'react';
import NavLeft from './Nav/NavLeft';
import NavRight from './Nav/NavRight';
import './../../styles/Header/nav/nav.css'

const NavComponent = () => {
  return (
    <>
      {/* Section navigation */}
      <nav className="nav">
        <NavLeft />
        <NavRight />
      </nav>
    </>
  );
};

export default NavComponent;
