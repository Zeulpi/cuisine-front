import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { getData } from './../resources/api-constants'
import { ROUTES } from './../resources/routes-constants'

export const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000); // temps actuel en secondes
    return decoded.exp - now;
  } catch (e) {
    console.warn("⛔ Token invalide :", e.message);
    return 0; // token cassé ou inexistant
  }
};

export const refreshToken = async (token) => {
    try {
      const response = await axios.post(getData(ROUTES.USER_REFRESH_ROUTE), { token });
      return response.data.token;
    } catch (error) {
      console.error("❌ Erreur lors du renouvellement du token :", error.response?.data || error.message);
      return null;
    }
  };