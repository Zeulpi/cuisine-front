import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './../../../store/reducers/store';  // Importer les hooks Redux

const NavRight = () => {
    // Utilisation de useSelector pour récupérer l'état de l'authentification dans le store Redux
    const { userEmail, isLoggedIn } = useAppSelector((state) => state.auth);

    return (
        <div className="right-nav">
            {isLoggedIn && (
                <ul>
                    <li><Link to="user/inventory">Frigo</Link></li>
                    <li><Link to="user/planner">Planner</Link></li>
                </ul>
            )}
        </div>
    );
}

export default NavRight;