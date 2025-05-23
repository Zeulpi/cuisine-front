import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router';
import '../../../styles/Header/nav/nav-left.css';

const NavLeft = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    const isHome = (location.pathname == '/') ? true : false;
    const isRecipe = ((location.pathname).includes('/recipe')) ? true : false;
    const locationColor = 'MediumSlateBlue';
    const locationNotColor = 'black';

    return (
        <div className="left-nav">
            <div><Link to="/"><FontAwesomeIcon icon={faHouse} color={isHome? locationColor : locationNotColor} /></Link></div>
            <div><Link to="/recipes"><span style={{color: (isRecipe) ? locationColor : locationNotColor}}>Recettes</span></Link></div>
        </div>
    );
}

export default NavLeft;