import { createAction } from '@reduxjs/toolkit'
import { Recipe } from '../interfaces/recipe'

export const setAllRecipes = createAction<Recipe[]>('recipe/setAllRecipes')
export const setRecipe = createAction<Recipe>('recipe/setRecipe')
export const removeRecipe = createAction<{ id: number }>('recipe/removeRecipe')
export const clearRecipes = createAction('recipe/logout')