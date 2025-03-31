import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../store/reducers/store";
import { RESOURCE_ROUTES } from './../../resources/routes-constants';
import { getResource } from './../../resources/back-constants';
import './../../styles/User/userPage.css'

const UserPage = () => {
  const { userEmail, userImage, isLoggedIn, userName } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();  // Récupérer dispatch pour envoyer des actions
  const [formData, setFormData] = useState({
    userName: userName || '',
    userEmail: userEmail || '',
    userImage: userImage || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Appel API à faire plus tard
    console.log('Infos à envoyer :', formData);
  };

  return (
    <div className="user-page container">
      <h1 className="user-title">Mon profil</h1>
      <form className="user-form" onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="form-group avatar-group">
          <label htmlFor="userimage">Avatar</label>
          <input type="file" id="userimage" name="userimage" className="input-file" />
          <div className="user-image">
            <img 
              src={getResource(RESOURCE_ROUTES.AVATAR_ROUTE, userImage ? formData.userImage : RESOURCE_ROUTES.DEFAULT_AVATAR)}
              alt="User Avatar" 
              className="user-avatar"
            />
          </div>
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Nom d&apos;utilisateur</label>
          <input
            type="text"
            id="username"
            name="userName"
            className="input-field"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Adresse email</label>
          <input
            type="email"
            id="email"
            name="userEmail"
            className="input-field"
            value={formData.userEmail}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-btn">Enregistrer</button>
      </form>
    </div>

  )
}

export default UserPage