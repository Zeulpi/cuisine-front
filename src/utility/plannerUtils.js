// import { useAppDispatch, useAppSelector} from '../store/reducers/store'
import { setAllRecipes } from '../store/actions/recipe'
import { getUserFromToken } from '../utility/getUserFromToken'
import { setServerTime, setUser } from '../store/actions/auth'
import { useAppSelector as appSelector } from '../store/reducers/store'
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

  export function getServerTime() {
    const [day, month, year] = (appSelector(state => state.auth.serverTime)).split('-');
    const serverTimeDate = new Date(`${year}-${month}-${day}`);

    return serverTimeDate;
  }

  export function compareDates(serverDate, plannerStart, dayIndex=0) {
    const [day, month, year] = plannerStart.split('-');
    const plannerDate = new Date(`${year}-${month}-${day}`);
    plannerDate.setDate(plannerDate.getDate() + dayIndex);

    return (serverDate <= plannerDate);
  }