import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/reducers/store'; // Utilisation du store Redux pour vérifier l'état de connexion



const UserLayout = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn); // Vérifier si l'utilisateur est connecté

  return isLoggedIn ?
  <div className="user-layout">
    <Outlet />
  </div>
  : <Navigate to="/" />;
};

export default UserLayout;
