import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);

    // Vérification expiration
    const now = Math.floor(Date.now() / 1000); // Timestamp actuel (en secondes)
    if (decoded.exp && decoded.exp < now) {
      console.warn("⚠️ Token expiré");
      return null;
    }

    return {
      userEmail: decoded.email || '',
      userName: decoded.username || '',
      userImage: decoded.userImage || null,
      userRole: decoded.roles || [],
    };
  } catch (error) {
    console.error("❌ Erreur de décodage du token :", error.message);
    return null;
  }
};
