import React, { useState, useEffect, use } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import { useAppDispatch, useAppSelector } from '../../store/reducers/store';
import { getShoppingIngredients } from '../../utility/shoppingUtils';
import LoadingComponent from '../Utils/loadingComponent';
import '../../styles/User/ShoppingModal.css'


export default function ShoppingModal({ isOpen, onClose, cardWidth, shoppingIndex }) {
  const userToken = useAppSelector((state) => state.auth.token);
  const planners = useAppSelector(state => state.auth.userPlanner);
  const plannerRecipes = planners[shoppingIndex].recipes ;
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(null);

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
    console.log(ingredients);
    // Re render lors du changement des ingredients
  }
  , [shoppingIndex, ingredients]);
    

  return (
    <>
      <div className='shopping-modal-title'>
        <h2 className='modal-title'>Liste de courses</h2>
        <button className="recipe-close-btn" onClick={onClose} tabIndex={5}>X</button>
      </div>
      <div className="shopping-modal-content" onClick={(e) => e.stopPropagation()} id='recipe-modal' style={{ '--card-width': cardWidth }}>
        <LoadingComponent loading={loading} loadingText="Connecting ..." />
        <div>
          <ul>
            {
              ingredients && Object.keys(ingredients).map((id) => {
                const ingredientList = ingredients[id];
                console.log(ingredientList);
    
                return ingredientList.map((ingredient, index) => {
                  return(
                    <>
                    <li key={ingredient.name}>
                      <strong>{ingredient.name}</strong>: 
                      <ul>
                          <li key={index}>
                            {ingredient.quantity} {ingredient.unit}
                          </li>
                      </ul>
                    </li>
                    </>
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