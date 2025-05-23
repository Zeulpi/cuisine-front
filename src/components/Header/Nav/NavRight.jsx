import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './../../../store/reducers/store';  // Importer les hooks Redux
import { useLocation } from 'react-router';
import '../../../styles/Header/nav/nav-right.css';

const NavRight = () => {
    // Utilisation de useSelector pour récupérer l'état de l'authentification dans le store Redux
    const { userEmail, isLoggedIn } = useAppSelector((state) => state.auth);
    const location = useLocation();
    
    const isPlanner = ((location.pathname).includes('/user/planner')) ? true : false;
    const isFridge = ((location.pathname).includes('/user/inventory')) ? true : false;
    const locationColor = 'MediumSlateBlue';
    const locationNotColor = 'black';

    return (
        <div className="right-nav">
            {isLoggedIn && (
                <>
                <div><Link to="user/inventory"><span style={{color: (isFridge) ? locationColor : locationNotColor}}>Frigo</span></Link></div>
                <div><Link to="user/planner"><span style={{color: (isPlanner) ? locationColor : locationNotColor}}>Planner</span></Link></div>
                </>
            )}
        </div>
    );
}

export default NavRight;