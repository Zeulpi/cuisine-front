import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';  // Importer dispatch de Redux
import { setUser } from './../../store/actions/auth';  // Action pour connecter l'utilisateur
import axios from 'axios';  // Pour effectuer la requête HTTP
import { ROUTES } from './../../resources/routes-constants';  // Importation des routes API
import { getData } from './../../resources/api-constants';  // Fonction pour obtenir l'URL de l'API
import PropTypes from 'prop-types';  // Validation des props
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoadingComponent from '../Utils/loadingComponent';
import RecipeList from '../../pages/RecipeList';
import '../../styles/User/RecipeModal.css'

const RecipeModal = ({ isOpen, onClose, dayChoice = '', chooseDay, cardWidth, chooseMeal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();  // Utilisation de dispatch de Redux
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page
  const [loading, setLoading] = useState(false);
  const listRef = useRef();


  useEffect(() => {
    // Lorsque la modale est ouverte, désactive le défilement du body
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Désactive le défilement du body
    } else {
      document.body.style.overflow = 'auto';  // Réactive le défilement du body
    }

    // Nettoyage du style lorsque la modale est fermée
    return () => {
      document.body.style.overflow = 'auto'; // Toujours réactiver le défilement du body à la fermeture de la modale
    };
  }, [isOpen]);

  const handleMeal = async (e) => {
    e.preventDefault();
    // try {
    //   setLoading(true);
    //   const response = await axios.post(getData(ROUTES.LOGIN_ROUTE), {
    //     email,
    //     password,
    //   });
  
    //   if (response.data.token) {
    //     const token = response.data.token;
    //     const user = getUserFromToken(token);
      
    //     if (user) {
    //       dispatch(setUser({ token, ...user }));
      
    //       onClose();
    //       if (location.pathname.includes("/register")) {
    //         navigate("/");
    //       }
    //     } else {
    //       setErrorMessage("Token invalide.");
    //     }
    //   }
    // } catch (error) {
    //   setErrorMessage(error.response?.data?.error || 'Erreur lors de la connexion');
    //   console.log(error);
      
    // } finally {
    //   setLoading(false);
    // }
  };

  if (!isOpen) return null;  // Ne rien afficher si la modale n'est pas ouverte

  return (
    <div className="recipe-modal-overlay" id='modal-frame' style={{ '--card-width': cardWidth }}>
      <div className='recipe-modal-body'>
        <div className='recipe-modal-title'>
          <h2 className='modal-title'>Choisissez une recette pour {dayChoice}</h2>
          <button className="recipe-close-btn" onClick={() =>{onClose(); chooseDay();}} tabIndex={5}>X</button>
        </div>
        <div className="recipe-modal-content" onClick={(e) => e.stopPropagation()} id='recipe-modal'>
          <RecipeList isModal={true} cardWidth='70%' ref={listRef} chooseMeal={chooseMeal} />
          {errorMessage && <p>{errorMessage}</p>}
          <LoadingComponent loading={loading} loadingText="Connecting ..." />
        </div>
      </div>
    </div>
  );
};

// Validation des props
RecipeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dayChoice: PropTypes.string,
  chooseDay: PropTypes.func,
  cardWidth: PropTypes.string,
  chooseMeal: PropTypes.func,
};

export default RecipeModal;
