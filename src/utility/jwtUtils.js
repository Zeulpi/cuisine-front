import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { getData } from './../resources/api-constants'
import { ROUTES } from './../resources/routes-constants'
import { getUserFromToken } from './getUserFromToken'
import { setServerTime, setUser } from "../store/actions/auth"

export async function getToken (email, password, dispatch) {
  let errorMessage = null;
  try {
    const response = await axios.post(getData(ROUTES.LOGIN_ROUTE),{ email, password });
    
    response ? console.log("Réponse du serveur :", response) : console.log("Aucune réponse du serveur");
    
    if (response && response.data.token) {
      const token = response.data.token;
      const user = getUserFromToken(token);
      user ? dispatch(setUser({ token, ...user })) : errorMessage = "Token invalide.";
    } else {
      errorMessage = response.message || "Erreur lors de la connexion.";
    }
    if (response.data.serverTime) {
      const servTime = response.data.serverTime;
      dispatch(setServerTime(servTime));
    }
  } catch (error) {
    errorMessage = "Erreur lors de la connexion. 500";
  }
  return errorMessage;
}

export const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000); // temps actuel en secondes
    return decoded.exp - now;
  } catch (error) {
    console.warn("⛔ Token invalide :");
    return 0; // token cassé ou inexistant
  }
};

export const refreshToken = async (token) => {
    try {
      const response = await axios.post(getData(ROUTES.USER_REFRESH_ROUTE), { token });
      return response.data.token;
    } catch (error) {
      console.error("❌ Erreur lors du renouvellement du token :");
      return null;
    }
  };