import { createAction } from '@reduxjs/toolkit'

export const setUser = createAction<{token: string, userEmail: string, userRole: string[], userImage: string, userName: string}>('auth/setAuth')
export const setToken = createAction<string>('auth/setToken')
export const setUserEmail = createAction<string>('auth/setUserEmail')
export const setUserRole = createAction<string>('auth/setUserRole')
export const setUserImage = createAction<string>('auth/setUserImage')
export const setUserName = createAction<string>('auth/setUserName')
export const logout = createAction('auth/logout')