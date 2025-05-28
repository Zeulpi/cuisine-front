import React, {useState, useEffect, useRef} from "react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../store/reducers/store";
import '../styles/User/FridgeSearchComponent.css'

export function FridgeSearchComponent() {
    const userToken = useAppSelector((state) => state.auth.token);
    const [userFridge, setUserFridge] = useState(useAppSelector(state => state.fridge.inventory));
    const [selectedIngredients, setSelectedIngredients] = useState(useAppSelector(state => state.fridge.inventory));
    const selectedRef = useRef(selectedIngredients);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const injectIngredientOverlays = () => {
        const cards = document.querySelectorAll('.card-content');

        cards.forEach(card => {
            const form = card.querySelector('form.ingredient-qtys');
            const body = card.querySelector('.card-body');

            // S'il n'y a pas de formulaire (donc pas un vrai ingrédient), on saute
            if (!form || !body) return;

            const id = form.dataset.id;
            const index = form.dataset.index;

            // Vérifie si un overlay est déjà présent
            if (!body.querySelector('.ingredient-overlay')) {
                const overlay = document.createElement('div');
                overlay.classList.add('ingredient-overlay');
                overlay.setAttribute('data-id', id);
                overlay.setAttribute('data-index', index);

                const check = document.createElement('span');
                check.classList.add('checkmark');
                check.textContent = '✓';
                overlay.appendChild(check);
                body.appendChild(overlay);

                // ➕ Ajoute la classe selected immédiatement
                overlay.classList.add('selected');

                // ➕ Assure que cet ingrédient est dans selectedIngredients
                const fullIngredient = userFridge[id]?.[index];
                if (fullIngredient) {
                    setSelectedIngredients(prev => {
                        const updated = { ...prev };
                        if (!updated[id]) updated[id] = [];
                        
                        const exists = updated[id].some(
                            ing => JSON.stringify(ing) === JSON.stringify(fullIngredient)
                        );
                        if (!exists) updated[id].push(fullIngredient);
                        
                        selectedRef.current = updated;
                        return updated;
                    });
                }

                // 👂 Ajoute le click listener
                overlay.addEventListener('click', () => {
                    toggleIngredientSelection(id, index);
                });
            }
        });
    }

    const toggleIngredientSelection = (id, index) => {
        const currentSelected = selectedRef.current;
        const newSelected = { ...currentSelected };
        const idx = Number(index);

        const overlay = document.querySelector(`.ingredient-overlay[data-id="${id}"][data-index="${index}"]`);

        // Cherche si l'ingrédient complet est déjà sélectionné
        const fullIngredient = userFridge[id][idx];
        const isAlreadySelected = newSelected[id]?.some(
            ing => JSON.stringify(ing) === JSON.stringify(fullIngredient)
        );

        if (isAlreadySelected) {
            newSelected[id] = newSelected[id].filter(
                ing => JSON.stringify(ing) !== JSON.stringify(fullIngredient)
            );
            if (newSelected[id].length === 0) delete newSelected[id];

            overlay?.classList.remove('selected');
        } else {
            if (!newSelected[id]) newSelected[id] = [];
            newSelected[id].push(fullIngredient);

            overlay?.classList.add('selected');
        }

        setSelectedIngredients(newSelected);
        selectedRef.current = newSelected;
    };


    useEffect(() => {
        const targetNode = document.querySelector('.ingredient-list-container');

        if (!targetNode) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    injectIngredientOverlays();
                }
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
        });

        // Injection initiale (au cas où les cards sont déjà là)
        injectIngredientOverlays();

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // console.log(selectedRef.current);
        if (Object.keys(selectedRef.current).length > 0) {
            navigate('/recipes', {
                state: {
                    ingredients: selectedRef.current, // ✅ uniquement les ingrédients sélectionnés
                },
            });
        }
    };



    return (
        <>
        {Object.keys(selectedIngredients).length > 0 && ( // Si l'inventaire du frigo n'est pas vide, afficher le bouton de recherche
            <>
            <div className="fridge-search-component">
                <button onClick={(e)=>handleSearch(e)} className="fridge-search-button">
                    Recettes avec les ingrédients choisis
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