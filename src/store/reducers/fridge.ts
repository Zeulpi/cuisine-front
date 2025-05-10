import { createReducer } from '@reduxjs/toolkit';
import { Fridge } from '../interfaces/fridge';
import { setFridge, clearFridge } from '../actions/fridge';


// Définir l'interface globale du state du reducer
interface FridgeReducer {
  inventory: Fridge[] | null;
}

// État initial : un tableau vide de recettes
const initialState: FridgeReducer = {
  inventory: [],
};

// Reducer qui gère les actions
const fridgeReducer = createReducer<FridgeReducer>(initialState, (builder) => {
  builder
    // Action pour ajouter ou mettre à jour une recette dans le tableau
    .addCase(setFridge, (state, action) => {
      state.inventory = action.payload; // Remplir l'inventory avec les ingredienst/unit/qty
    })
    .addCase(clearFridge, (state) => {
      state.inventory = []; // Vider l'inventaire
    })
    ;
});

export default fridgeReducer;