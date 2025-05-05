import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store/reducers/store';
import PropTypes from 'prop-types';  // Validation des props
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoadingComponent from '../../Utils/loadingComponent';
import { getToken } from '../../../utility/jwtUtils';

const LoginModal = ({ isOpen, onClose, prefillEmail = null }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();  // Utilisation de dispatch de Redux
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginMessage = await getToken(email, password, dispatch);  // Appel de la fonction pour obtenir le token
    // console.log(loginMessage);
    setErrorMessage(loginMessage);

    if (loginMessage === null) {
      // console.log(loginMessage);
      onClose();
      location.pathname.includes("/register") ? navigate("/") : null;
    }
    // else {
    //   setErrorMessage('erreur : ', loginMessage);
    // }
    setLoading(false);
    // return loginMessage;
  };

  if (!isOpen) return null;  // Ne rien afficher si la modale n'est pas ouverte

  return (
    <div className="modal-overlay">
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
                onPaste={(e) => setEmail(e.target.value)}
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
                onPaste={(e) => setPassword(e.target.value)}
                tabIndex={2}  // Pour l'accessibilité
              />
            </div>
          </div>
          {/* {errorMessage && console.log(errorMessage)} */}
          {errorMessage && <p>{errorMessage}</p>}
          <LoadingComponent loading={loading} loadingText="Connecting ..." />
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
  prefillEmail: PropTypes.string
};

export default LoginModal;
