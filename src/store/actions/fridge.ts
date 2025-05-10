import { createAction } from '@reduxjs/toolkit'
import { Fridge } from '../interfaces/fridge'

export const setFridge = createAction<Fridge[]>('fridge/setFridge')
export const clearFridge = createAction<Fridge[]>('fridge/clearFridge')