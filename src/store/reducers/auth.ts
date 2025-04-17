import { createReducer } from '@reduxjs/toolkit';
import { Planner } from '../interfaces/planner';
import { setUser, logout, setToken, setUserEmail, setUserImage, setUserRole, setUserName, setUserPlanner, setPlannerRecipe } from '../actions/auth';



interface AuthReducer {
  token: string | null;
  userEmail: string | null;
  isLoggedIn: boolean;
  userRole: string[] | null;
  userImage: string | null;
  userName: string | null;
  userPlanner: Planner[] | null;
}

const initialState: AuthReducer = {
  token: null,
  userEmail: null,
  isLoggedIn: false,
  userRole: [],
  userImage: null,
  userName: null,
  userPlanner: null,
};

const authReducer = createReducer<AuthReducer>(initialState, (builder) => {
    builder
      // Action pour la connexion
      .addCase(setUser, (state, action) => {
        state.token = action.payload.token;
        state.userEmail = action.payload.userEmail;
        state.userRole = action.payload.userRole;
        state.userImage = action.payload.userImage;
        state.userName = action.payload.userName;
        state.isLoggedIn = true;
        state.userPlanner = action.payload.userPlanner;
      })
      // Action pour la déconnexion
      .addCase(logout, (state) => {
        state.token = null;
        state.userEmail = null;
        state.userRole = [];
        state.userImage = null;
        state.userName = null;
        state.isLoggedIn = false;
        state.userPlanner = null;
      })
      // Action pour mettre à jour l'image de l'utilisateur
      .addCase(setUserImage, (state, action) => {
        state.userImage = action.payload;
      })
      // Action pour mettre à jour l'image de l'utilisateur
      .addCase(setUserName, (state, action) => {
        state.userName = action.payload;
      })
      .addCase(setUserPlanner, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.userPlanner = action.payload;
        } else {
          console.error("Erreur : Le payload de userPlanner doit être un tableau d'objets.");
          state.userPlanner = [];  // Optionnellement, tu peux assigner un tableau vide si l'assignation échoue.
        }
      })
      .addCase(setPlannerRecipe, (state, action) => {
        const { keyword, recipeId } = action.payload;
      
        // Vérifie si userPlanner et le planner à l'index 0 existent
        if (
          state.userPlanner &&
          state.userPlanner[0] &&  // Accède au premier planner (Planner[0])
          Array.isArray(state.userPlanner[0].recipes)  // Vérifie que 'recipes' est un tableau
        ) {
          if (recipeId === null) {
            // Si recipeId est null, on supprime l'entrée avec le mot-clé (keyword)
            state.userPlanner[0].recipes = state.userPlanner[0].recipes.filter(
              (recipe) => Object.keys(recipe)[0] !== keyword
            );
          } else {
            // Sinon, on ajoute ou met à jour la recette
            const existingRecipe = state.userPlanner[0].recipes.find(
              (recipe) => Object.keys(recipe)[0] === keyword
            );
      
            if (existingRecipe) {
              // On utilise 'as Record<string, number>' pour éviter l'erreur de type
              (existingRecipe as Record<string, number>)[keyword] = recipeId;
            } else {
              // Sinon, on ajoute un nouvel objet avec le mot-clé et l'ID de la recette
              state.userPlanner[0].recipes.push({ [keyword]: recipeId });
            }
          }
        } else {
          console.error('Le planner ou la propriété "recipes" est invalide.');
        }
      })
      ;
  });

export default authReducer;
