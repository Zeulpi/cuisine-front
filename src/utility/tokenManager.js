// tokenManager.js
import { getTokenRemainingTime, refreshToken } from './jwtUtils'; // Import des utilitaires
import { logout, setUser } from '../store/actions/auth'; // Actions Redux pour se déconnecter et mettre à jour l'utilisateur
import { initUserFromStorage } from './initUserFromStorage'; // Utilitaire pour récupérer les données utilisateur depuis le storage

export const startTokenRefresh = (dispatch, navigate, location) => {
  const intervalId = setInterval(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const remaining = getTokenRemainingTime(token);

    if (remaining <= 0) {
      dispatch(logout()); // Déconnecter l'utilisateur si le token est expiré
      if (location.pathname.includes('/user')) {
        navigate('/'); // Rediriger vers la page d'accueil
      }
    } else if (remaining > 0 && remaining < 86400) { // Si le token expire dans moins d'un jour
      const newToken = await refreshToken(token);
      if (newToken) {
        localStorage.setItem('token', newToken); // Sauvegarder le nouveau token dans le localStorage

        const updatedUser = initUserFromStorage();
        if (updatedUser) {
          dispatch(setUser(updatedUser)); // Mettre à jour les données utilisateur dans Redux
        }
      }
    }
  }, 3 * 60 * 60 * 1000); // Vérification toutes les 3 heures

  return intervalId; // Retourne l'ID de l'intervalle pour pouvoir le nettoyer
};

export const stopTokenRefresh = (intervalId) => {
  clearInterval(intervalId); // Arrêter l'intervalle quand il n'est plus nécessaire
};
