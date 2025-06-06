import { createAction } from '@reduxjs/toolkit'
import { Planner } from '../interfaces/planner';

export const setUser = createAction<{token: string, userEmail: string, userRole: string[], userImage: string, userName: string, userPlanner: Planner[]}>('auth/setAuth')
export const setToken = createAction<string>('auth/setToken')
export const setServerTime = createAction<string>('auth/setServerTime')
export const setUserEmail = createAction<string>('auth/setUserEmail')
export const setUserRole = createAction<string>('auth/setUserRole')
export const setUserImage = createAction<string>('auth/setUserImage')
export const setUserName = createAction<string>('auth/setUserName')
export const setUserPlanner = createAction<{ userPlanner: Planner[][] }>('auth/setUserPlanner');
export const setPlannerRecipe = createAction<{keyword: string; recipeId: number; portions: number}>('auth/setPlannerRecipe');
export const logout = createAction('auth/logout')