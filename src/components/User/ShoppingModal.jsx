import React, { useState, useEffect, use } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import { useAppDispatch, useAppSelector } from '../../store/reducers/store';
import { getShoppingIngredients } from '../../utility/shoppingUtils';
import { addListToInventory } from '../../utility/FridgeUtils';
import LoadingComponent from '../Utils/loadingComponent';
import '../../styles/User/ShoppingModal.css'


export default function ShoppingModal({ isOpen, onClose, cardWidth, shoppingIndex }) {
  const userToken = useAppSelector((state) => state.auth.token);
  const planners = useAppSelector(state => state.auth.userPlanner);
  const plannerRecipes = planners[shoppingIndex].recipes ;
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState(null);
  const [addMessage, setAddMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    
    async function fetchShoppingIngredients() {
      setLoading(true);
      try {
        const result = await getShoppingIngredients(plannerRecipes, userToken);
        setIngredients(result.ingredients);
      } catch (error) {
        setErrorMessage("Erreur lors de la récupération des ingrédients.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchShoppingIngredients();
  }, []);

  useEffect(() => {
    // console.log(ingredients);
    // Re render lors du changement des ingredients
  }
  , [shoppingIndex, ingredients]);

  useEffect(()=> {
    // console.log(data);
  }, [data]);

  async function handleAddList() {
    setLoading(true);
    let result;
    try {
      result = await addListToInventory (dispatch, userToken, ingredients);
      setData(result);
      handleAddMessage();
    } catch (error) {
      setErrorMessage("Erreur lors du traitement de la liste");
    } finally {
      setLoading(false);
    }
  }

  const handleAddMessage = () => {
    const messageDiv = document.querySelector(".shopping-add-message");
    setAddMessage("Liste ajoutée à l'inventaire");
    // Affiche le message immédiatement
    messageDiv.style.display = "flex";
    messageDiv.classList.remove("fade-out");
    // Après 5s → démarre la transition (fade out)
    setTimeout(() => {
      messageDiv.classList.add("fade-out");
    }, 5000);
    // Après 5s + 2s (temps de la transition) → cache complètement
    setTimeout(() => {
      messageDiv.style.display = "none";
      messageDiv.classList.remove("fade-out"); // prêt pour le prochain affichage
    }, 7000);
  };


  return (
    <>
      <div className='shopping-modal-title-container'>
        <div className='shopping-modal-title'>
          <h2 className='modal-title'>Liste de courses</h2>
          &nbsp;&nbsp;
          <button
            className="select-button"
            style={{marginBlock:'auto'}}
            onClick={handleAddList}
            disabled={loading}
            title='Ajouter la liste a votre inventaire'
          >+</button>
        </div>
        <div className='shopping-add-message'>{addMessage && (<span className='shopping-message'>{addMessage}</span>)}</div>
        <button className="recipe-close-btn" onClick={onClose} tabIndex={5}>X</button>
      </div>
      <div className="shopping-modal-content" onClick={(e) => e.stopPropagation()} id='recipe-modal' style={{ '--card-width': cardWidth }}>
        <LoadingComponent loading={loading} loadingText="Connecting ..." />
        <div>
          <ul>
            {
              ingredients && Object.keys(ingredients).map((id) => {
                const ingredientList = ingredients[id];
    
                return ingredientList.map((ingredient, index) => {
                  return(
                    <li key={`${id}-${ingredient.unit}`}>
                      <strong>{ingredient.name}</strong>: 
                      <ul>
                          <li key={`detail-${id}-${ingredient.unit}`}>
                            {ingredient.quantity} {ingredient.unit}
                          </li>
                      </ul>
                    </li>
                  )
                });
              })
            }
          </ul>
        </div>
      </div>
    </>
  );
}

ShoppingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cardWidth: PropTypes.string,
  shoppingIndex: PropTypes.number.isRequired,
};