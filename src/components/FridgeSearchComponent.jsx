import React, {useState, useRef} from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../store/reducers/store";
import '../styles/User/FridgeSearchComponent.css'

export function FridgeSearchComponent() {
    const userToken = useAppSelector((state) => state.auth.token);
    const userFridge = useAppSelector(state => state.fridge.inventory);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        // console.log("User Fridge:", Object.keys(userFridge).length, userFridge);

        Object.keys(userFridge).length > 0 && navigate('/recipes', {
            state: {
                ingredients: userFridge,
            },
        });
    };


    return (
        <>
        {Object.keys(userFridge).length > 0 && ( // Si l'inventaire du frigo n'est pas vide, afficher le bouton de recherche
            <>
            <div className="fridge-search-component">
                <button onClick={(e)=>handleSearch(e)} className="fridge-search-button">
                    Recettes avec mes ingrédients
                </button>
            </div>
            </>
        )}
        </>
    );
}
FridgeSearchComponent.propTypes = {
    // Define any prop types if needed
};