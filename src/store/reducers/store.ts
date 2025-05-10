import { ThunkDispatch, UnknownAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage
import auth from './auth'
import recipe from './recipe'
import fridge from './fridge'

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const rootReducer = combineReducers({
    auth,
    recipe,
    fridge,
})

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage,
        whitelist: ['auth', 'recipe', 'fridge'],
    },
    rootReducer
)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, any, UnknownAction>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const persistor = persistStore(store)
