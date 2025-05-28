// import { useAppDispatch, useAppSelector} from '../store/reducers/store'
import { setAllRecipes } from '../store/actions/recipe'
import { getUserFromToken } from '../utility/getUserFromToken'
import { setServerTime, setUser } from '../store/actions/auth'
import { useAppSelector as appSelector } from '../store/reducers/store'
import { addListToInventory } from './FridgeUtils'
import { getShoppingIngredients } from './shoppingUtils'
import { getData } from '../resources/api-constants'
import { ROUTES } from '../resources/routes-constants'
import axios from 'axios'


export async function sendPlannerToServer (keyWord, recipe, portions, dispatch, userToken, index) {
  let errorMessage = null;
  try {
    // console.log('Sending planner to server...', index); // Debugging line
    const response = await axios.post(getData(ROUTES.USER_SEND_PLANNER_ROUTE), { 
      token: userToken,
      index: index,
      day: keyWord,
      recipeId: recipe.id,
      portions: portions
    });
    
    // Vérification de la réponse et mise à jour du store utilisateur
    if (response.data.token) {
      const newToken = response.data.token;
      const user = getUserFromToken(newToken);
      user ? dispatch(setUser({ token: newToken, ...user })) : errorMessage = "Token invalide.";
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }

    // Vérification si des recettes ont été renvoyées et mise à jour du store des recettes
    if (response.data.recipes) {
      // Dispatch pour mettre à jour le store des recettes
      dispatch(setAllRecipes(response.data.recipes)); // Exemple, cette action doit être définie dans ton store
    } else {
      errorMessage = "Aucune recette n'a été renvoyée.";
    }
  } catch (error) {
    console.log('Erreur lors de la connexion :', error.response.data);
    errorMessage = "Erreur lors de la connexion.";
  }
  return errorMessage;
}

export async function destockIngredients (recipes, keyWord, plannerIndex, userToken, dispatch, destock = false) {
  let ingredientList;
  const result = await getShoppingIngredients (recipes, userToken, plannerIndex, 1);
  // console.log('recipes : ', recipes);
  // console.log('result : ', result);
  if(result.ingredients){
    ingredientList = result.ingredients;
    Object.keys(ingredientList).map((id) => {
      const ingredient = (result.ingredients)[id];
      // console.log(ingredient);
      ingredient.map((ing, index) => {
        ing.quantity = -(ing.quantity);
        // console.log(ing.quantity);
      });
    });

    if (destock) {
      // console.log('liste : ', ingredientList);
      try {
        const result = await addListToInventory (dispatch, userToken, ingredientList);
        setTimeout(() => {
          // un petit timer pour attendre que le store soit mis a jour avant de re-render
        }, 200);
      } catch (error) {
        console.log("Erreur lors du traitement de la liste", error);
      }
    }
  }

  // Ensuite marquer le repas comme marqué dans le planner
  try{
    const isMarked = await setMealMarked(dispatch, userToken, keyWord, plannerIndex);
    // console.log(isMarked);
  } catch (error) {
    console.log("Erreur, repas non marqué", error);
  }
  return ingredientList;
}

export async function setMealMarked(dispatch, userToken, keyWord, plannerIndex) {
  let errorMessage = null;
  try {
    const response = await axios.post(getData(ROUTES.USER_MARK_PLANNER_ROUTE), { 
      token: userToken,
      index: plannerIndex,
      day: keyWord,
    });
    
    // Vérification de la réponse et mise à jour du store utilisateur
    if (response.data.token) {
      const newToken = response.data.token;
      const user = getUserFromToken(newToken);
      user ? (dispatch(setUser({ token: newToken, ...user })), errorMessage="marked") : errorMessage = "Token invalide.";
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }

  } catch (error) {
    console.log('Erreur lors de la connexion :', error.response.data);
    errorMessage = "Erreur lors de la connexion.";
  }
  return errorMessage;
}

export async function getPlannersFromServer (userToken, dispatch) {
  let errorMessage = null;
  try {
    const response = await axios.get(getData(ROUTES.USER_GET_PLANNER_ROUTE), { 
      params: {
          token: userToken
      },
    });
    // console.log(response);

    // Vérification de la réponse et mise à jour du store utilisateur
    if (response.data.token) {
      const newToken = response.data.token;
      const user = getUserFromToken(newToken);
      user ? dispatch(setUser({ token: newToken, ...user })) : errorMessage = "Token invalide.";
      errorMessage = response.data.updatedExpired ? 'updated' : null;
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }

    // Vérification si des recettes ont été renvoyées et mise à jour du store des recettes
    if (response.data.recipes) {
      // Dispatch pour mettre à jour le store des recettes
      dispatch(setAllRecipes(response.data.recipes)); // Exemple, cette action doit être définie dans ton store
    } else {
      errorMessage = "Aucune recette n'a été renvoyée.";
    }
    if (response.data.serverTime) {
      const servTime = response.data.serverTime;
      dispatch(setServerTime(servTime));
    }
  } catch (error) {
    console.log('Erreur lors de la connexion :', error.response.data);
    errorMessage = "Erreur lors de la connexion.";
  }
  return errorMessage;
}

export async function removeRecipeFromPlanner (keyWord, dispatch, userToken, index) {
  let errorMessage = null;
  try {
    const response = await axios.post(getData(ROUTES.USER_DELETE_PLANNER_ROUTE), {
      token: userToken,
      index: index,
      day: keyWord,
    });
    // console.log('Response:', response.data); // Debugging line
    
    // Vérification de la réponse et mise à jour du store utilisateur
    if (response.data.token) {
      const newToken = response.data.token;
      const user = getUserFromToken(newToken);
      user ? dispatch(setUser({ token: newToken, ...user })) : errorMessage = "Token invalide.";
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }

    // Vérification si des recettes ont été renvoyées et mise à jour du store des recettes
    if (response.data.recipes) {
      // Dispatch pour mettre à jour le store des recettes
      dispatch(setAllRecipes(response.data.recipes)); // Exemple, cette action doit être définie dans ton store
    } else {
      errorMessage = "Aucune recette n'a été renvoyée.";
    }
  } catch (error) {
    console.log('Erreur lors de la connexion :', error.response.data);
    errorMessage = "Erreur lors de la connexion.";
  }
  return errorMessage;
}

export const adjustTableSize = () => { // Ajustement dynamique de la largeur des colonnes
  const card = document.querySelector('.recipe-card');
  const dayCells = document.querySelectorAll('.day-cell');
  let maxWidth = 0;
  
  const adjustAllColumns = () => {
    dayCells.forEach(cell => { // Trouver la colonne la plus large
      maxWidth = Math.max(maxWidth, cell.offsetWidth);
    });
  };
  
  if (card){  // Si une carte est presente dans le tableau, toutes les colonnes prennent la largeur de la carte
    dayCells.forEach(cell => {
      cell.style.width = `${card.offsetWidth}px`;
    });
    // console.log('card presente');
  } else { // Si pas de carte, reset toutes les colonnes au mini, puis ajustement en fonction de la plus large
    maxWidth = 0; // Réinitialiser maxWidth
    dayCells.forEach(cell => { // reset de toutes les largeurs de colonnes
      cell.style.width = 'auto';
    });
    adjustAllColumns(); // Trouver la colonne la plus large
    dayCells.forEach(cell => {
      cell.style.width = `${maxWidth}px`; 
    });
    // console.log('card absente');
  }
};