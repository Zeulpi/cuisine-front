import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const NavLeft = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="left-nav">
            <ul>
                <li><Link to="/"><FontAwesomeIcon icon={faHouse} /></Link></li>
                <li><Link to="/recipes">Recettes</Link></li>
                <li>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    Saison {isDropdownOpen && "↓"}
                </button>
                {isDropdownOpen && <ul><li>Option 1</li><li>Option 2</li></ul>}
                </li>
            </ul>
        </div>
    );
}

export default NavLeft;