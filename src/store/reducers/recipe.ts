import { createReducer } from '@reduxjs/toolkit';
import { setRecipe, removeRecipe, clearRecipes } from '../actions/recipe';
import { Recipe } from '../interfaces/recipe'; // Importer l'interface Recipe

// Définir l'interface de chaque recette


// Définir l'interface globale du state du reducer
interface RecipeReducer {
  recipes: Recipe[]; // Stocke un tableau de recettes
}

// État initial : un tableau vide de recettes
const initialState: RecipeReducer = {
  recipes: [],
};

// Reducer qui gère les actions
const recipeReducer = createReducer<RecipeReducer>(initialState, (builder) => {
  builder
    // Action pour ajouter ou mettre à jour une recette dans le tableau
    .addCase(setRecipe, (state, action) => {
      const recipeToStore = action.payload; // Ici, recipeToStore est directement l'objet recette

      // Vérifier si la recette existe déjà dans le tableau
      const existingRecipeIndex = state.recipes.findIndex((recipe) => recipe.id === recipeToStore.id);

      if (existingRecipeIndex !== -1) {
        // Si la recette existe déjà, la mettre à jour
        state.recipes[existingRecipeIndex] = recipeToStore;
      } else {
        // Sinon, ajouter la nouvelle recette au tableau
        state.recipes.push(recipeToStore);
      }
    })
    .addCase(removeRecipe, (state, action) => {
      const { id } = action.payload;

      // Supprimer la recette avec l'ID spécifié
      state.recipes = state.recipes.filter((recipe) => recipe.id !== id);
    })
    // Action pour la déconnexion
    .addCase(clearRecipes, (state) => {
        state.recipes = [];
    })
    ;
});

export default recipeReducer;
