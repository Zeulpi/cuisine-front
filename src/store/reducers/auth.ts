import { createReducer } from '@reduxjs/toolkit';
import { setUser, logout, setToken, setUserEmail, setUserImage, setUserRole, setUserName } from '../actions/auth';

interface AuthReducer {
  token: string | null;
  userEmail: string | null;
  isLoggedIn: boolean;
  userRole: string[] | null;
  userImage: string | null;
  userName: string | null;
}

const initialState: AuthReducer = {
  token: null,
  userEmail: null,
  isLoggedIn: false,
  userRole: [],
  userImage: null,
  userName: null,
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
      })
      // Action pour la déconnexion
      .addCase(logout, (state) => {
        state.token = null;
        state.userEmail = null;
        state.userRole = [];
        state.userImage = null;
        state.userName = null;
        state.isLoggedIn = false;
      })
      // Action pour mettre à jour l'image de l'utilisateur
      .addCase(setUserImage, (state, action) => {
        state.userImage = action.payload;
      })
      // Action pour mettre à jour l'image de l'utilisateur
      .addCase(setUserName, (state, action) => {
        state.userName = action.payload;
      })
      ;
  });

export default authReducer;
