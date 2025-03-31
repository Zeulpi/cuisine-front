import React, { useState } from 'react';
import { useDispatch } from 'react-redux';  // Importer dispatch de Redux
import { setUser } from './../../../store/actions/auth';  // Action pour connecter l'utilisateur
import axios from 'axios';  // Pour effectuer la requête HTTP
import { ROUTES } from './../../../resources/routes-constants';  // Importation des routes API
import { getData } from './../../../resources/api-constants';  // Fonction pour obtenir l'URL de l'API
import PropTypes from 'prop-types';  // Validation des props
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Register from './Register';  // Importer le composant d'inscription

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();  // Utilisation de dispatch de Redux
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(getData(ROUTES.LOGIN_ROUTE), {
        email,
        password,
      });
  
      if (response.data.token) {
        const { token, user } = response.data;
        const { roles, userImg, userName } = user;
        // Mettre à jour le store avec Redux
        dispatch(setUser({ token, userEmail: email, userRole: roles, userImage: userImg, userName: userName}));
  
        // Fermer la modale
        onClose();
        if (location.pathname.includes("/register")) {
          navigate("/");  // Rediriger vers la page d'accueil si l'utilisateur est sur une page réservée
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Erreur lors de la connexion');
    }
  };

  if (!isOpen) return null;  // Ne rien afficher si la modale n'est pas ouverte

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} tabIndex={5}>X</button>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                tabIndex={1}  // Pour l'accessibilité
                autoFocus
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                tabIndex={2}  // Pour l'accessibilité
              />
            </div>
          </div>
          {errorMessage && <p>{errorMessage}</p>}
          <div className="form-btns">
            <button type="submit" className='login-connect' tabIndex={3}>Se connecter</button>
            <Link to="register" className="login-register" tabIndex={4}>
              <button className='login-register' onClick={onClose}>Inscription</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Validation des props
LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginModal;
