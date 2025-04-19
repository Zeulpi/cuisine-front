// import { useAppDispatch, useAppSelector} from '../store/reducers/store'
import { setAllRecipes } from '../store/actions/recipe'
import { getUserFromToken } from '../utility/getUserFromToken'
import { setUser } from '../store/actions/auth'
import { getData } from '../resources/api-constants'
import { ROUTES } from '../resources/routes-constants'
import axios from 'axios'


export async function sendPlannerToServer (keyWord, recipe, portions, dispatch, userToken) {

    let errorMessage = null;
    try {
      const response = await axios.post(getData(ROUTES.USER_SEND_PLANNER_ROUTE), { 
        token: userToken,
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

  export async function getPlannersFromServer (userToken, dispatch) {
    let errorMessage = null;
    try {
      const response = await axios.get(getData(ROUTES.USER_GET_PLANNER_ROUTE), { 
        params: {
            token: userToken
        },
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

  export async function removeRecipeFromPlanner (keyWord, dispatch, userToken) {
    let errorMessage = null;
    try {
      const response = await axios.post(getData(ROUTES.USER_DELETE_PLANNER_ROUTE), {
        token: userToken,
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