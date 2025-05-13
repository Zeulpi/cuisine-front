// import { useAppDispatch, useAppSelector} from '../store/reducers/store'
import { getUserFromToken } from '../utility/getUserFromToken'
import { setFridge } from '../store/actions/fridge'
import { setUser } from '../store/actions/auth'
import { useAppSelector as appSelector } from '../store/reducers/store'
import { getData } from '../resources/api-constants'
import { ROUTES } from '../resources/routes-constants'
import axios from 'axios'


export async function addIngredientToInventory (dispatch, userToken, ingredientId, ingredientQuantity, ingredientUnit) {
  let errorMessage = null;
  try {
    // console.log('Adding ingredient to inventory...'); // Debugging line
    const response = await axios.post(getData(ROUTES.USER_ADD_FRIDGE_ROUTE), { 
      token: userToken,
      ingredientId,
      ingredientQuantity,
      ingredientUnit,
    });
    
    // console.log('back response add : ', response.data);

    // Vérification de la réponse et mise à jour du store utilisateur
    if (response.data.token) {
      const newToken = response.data.token;
      const user = getUserFromToken(newToken);
      user ? (dispatch(setUser({ token: newToken, ...user })), errorMessage=response.updated) : errorMessage = "Token invalide.";
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }

    // Recupération de l'inventaire et mise a jour
    if (response.data.inventory) {
      // Dispatch pour mettre à jour le store du Fridge
      dispatch(setFridge(response.data.inventory));
    } else {
      errorMessage = "L'inventaire n'a pas été renvoyé.";
    }
  } catch (error) {
    console.log('Erreur lors de la connexion :', error.response.data);
    errorMessage = "Erreur lors de la connexion.";
  }
  return errorMessage;
}

export async function getFridgeFromServer (userToken, dispatch) {
  let errorMessage = null;
  try {
    const response = await axios.get(getData(ROUTES.USER_GET_FRIDGE_ROUTE), { 
      params: {
          token: userToken
      },
    });
    // console.log('back response get : ', response);

    // Vérification de la réponse et mise à jour du store utilisateur
    if (response.data.token) {
      const newToken = response.data.token;
      const user = getUserFromToken(newToken);
      user ? dispatch(setUser({ token: newToken, ...user })) : errorMessage = "Token invalide.";
      errorMessage = response.data.updated ? 'updated' : null;
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }

    // Recupération de l'inventaire et mise a jour
    if (response.data.inventory) {
      // Dispatch pour mettre à jour le store du Fridge
      dispatch(setFridge(response.data.inventory));
    } else {
      errorMessage = "L'inventaire n'a pas été renvoyé.";
    }
  } catch (error) {
    console.log('Erreur lors de la connexion :', error.response.data);
    errorMessage = "Erreur lors de la connexion.";
  }
  return errorMessage;
}

export async function getIngredients(page, limit, filters) {
  let errorMessage = null;
  try {
    const response = await axios.get(getData(ROUTES.USER_GET_INGREDIENTS_ROUTE), {
      params: {
        page,
        limit,
        search : filters.search
      },
    });

    if (response.data.ingredients) {
      return response.data;
    } else {
      errorMessage = "Liste d'ingrédients non recupérée.";
    }
    
  } catch (error) {
    errorMessage = error;
    console.error('Erreur lors du chargement des ingredients :', error);
  }
  return errorMessage;
}