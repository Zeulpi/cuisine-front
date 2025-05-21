import React, { useState, useEffect, use } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import { useAppDispatch, useAppSelector } from '../../store/reducers/store';
import { compareCourseWithInventory } from '../../utility/shoppingUtils';
import { addListToInventory } from '../../utility/FridgeUtils';
import LoadingComponent from '../Utils/loadingComponent';
import { ProgressBar } from '../Utils/ProgressBar';
import '../../styles/User/ShoppingModal.css'


export default function ShoppingModal({ isOpen, onClose, cardWidth, ingredientList, shoppingTitle=null }) {
  const COLOR1 = 'lightgreen';
  const COLOR2 = 'LightCoral';
  const userToken = useAppSelector((state) => state.auth.token);
  const planners = useAppSelector(state => state.auth.userPlanner);
  // const plannerRecipes = planners[shoppingIndex].recipes ;
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState(null);
  const [addMessage, setAddMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(null);
  const dispatch = useAppDispatch();
  const userFridge = useAppSelector(state => state.fridge.inventory);
  const [updatedList, setUpdatedList] = useState(null);

  useEffect(() => { // des le chargement de la page, recuperer la liste des ingredients
    setIngredients(ingredientList);
  }, []);

  useEffect(() => {
    // Mettre a jour la liste d'ingrediuents avec les quantités de l'inventaire et les quantités nécessaires
    const newList = compareCourseWithInventory(ingredients, userFridge);
    setUpdatedList(newList);
  }
  , [ingredientList, ingredients, userFridge]);

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
    <div className='shopping-modal'>
      <div className='shopping-modal-title-container'>
        <div className='shopping-modal-title'>
          <h2 className='modal-title'>Liste de courses pour : {shoppingTitle}</h2>
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
        <button className="shopping-close-btn" onClick={onClose} tabIndex={5}>X</button>
      </div>
      <div className="shopping-modal-content" onClick={(e) => e.stopPropagation()} id='recipe-modal' style={{ '--card-width': cardWidth }}>
        <LoadingComponent loading={loading} loadingText="Connecting ..." />
        <div className='shopping-list-container'>
          <ul className='shopping-list'>
            {
              updatedList && Object.keys(updatedList).map((id) => {
                const ingredientList = updatedList[id];
    
                return ingredientList.map((ingredient, index) => {
                  return(
                    <li key={`${id}-${ingredient.unit}`}>
                      <strong>{ingredient.name}</strong>: 
                      <ul>
                          <li key={`detail-${id}-${ingredient.unit}`}>
                            <ProgressBar
                              ownedQty={ingredient.inventory}
                              totalQty={ingredient.quantity}
                              progressUnit={ingredient.unit}
                              ownedColor={COLOR1}
                              totalColor={COLOR2}
                            />
                          </li>
                      </ul>
                    </li>
                  )
                });
              })
            }
          </ul>
          <div className='shopping-infos'>
            {ingredients && Object.keys(updatedList).length > 0 && (
              <>
              <p>
                Liste de tous les ingrédients nécessaires pour la semaine<br/>
                Seuls les jours restants de la semaine sont pris en compte (aujourd&lsquo;hui inclus)
              </p>
              <p>En <span style={{color: COLOR1,backgroundColor:COLOR1 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, les ingrédients que vous avez déja dans votre inventaire</p>
              <p>En <span style={{color: COLOR2,backgroundColor:COLOR2 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, les quantités qui vous manquent</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ShoppingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cardWidth: PropTypes.string,
  shoppingIndex: PropTypes.number.isRequired,
  recipeList: PropTypes.Object,
  ingredientList: PropTypes.Object,
  shoppingTitle: PropTypes.string,
};