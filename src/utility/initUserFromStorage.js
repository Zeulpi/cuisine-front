import { getUserFromToken } from "./getUserFromToken";

export const initUserFromStorage = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const user = getUserFromToken(token);
  if (!user) {
    localStorage.removeItem("token"); // Token invalide ou expiré
    return null;
  }

  return {
    token,
    ...user
  };
};
