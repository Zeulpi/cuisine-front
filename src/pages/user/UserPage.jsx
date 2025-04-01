import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from "../../store/reducers/store"
import { RESOURCE_ROUTES } from './../../resources/routes-constants'
import { getResource } from './../../resources/back-constants'
import { getData } from './../../resources/api-constants'
import { ROUTES } from './../../resources/routes-constants'
import './../../styles/User/userPage.css'
import { updatePasswordRulesUI, isPasswordValid, renderPasswordRules, isAllPassValid, isFormValid } from "../../utility/formValidation"
import { getUserFromToken } from '../../utility/getUserFromToken'
import { setUser } from '../../store/actions/auth'
import axios from 'axios'


const UserPage = () => {
  const { token, userEmail, userImage, isLoggedIn, userName } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();  // Récupérer dispatch pour envoyer des actions
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validatedPassword, setValidatedPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [updatedFields, setUpdatedFields] = useState([]);

  const initialUserData = {
    userEmail,
    userName,
    userImage, // si tu l’utilises plus tard
  };

  const [formData, setFormData] = useState({
    userName: userName || '',
    userEmail: userEmail || '',
    userImage: userImage || '',
  });

  useEffect(() => {
    updatePasswordRulesUI(password);
  
    const pwdCheck = document.getElementById("pwd-valid");
    const confirmCheck = document.getElementById("pwd-confirm");
  
    const rulesOk = isPasswordValid(password);
    pwdCheck.style.display = password !== '' && rulesOk ? "inline" : "none";
  
    const allValid = isAllPassValid(password, confirmPassword);
    confirmCheck.style.display = allValid ? "inline" : "none";

    setValidatedPassword(allValid ? password : '');
  }, [password, confirmPassword]);

  const hasChanges = () => {
    const emailChanged = formData.userEmail !== initialUserData.userEmail;
    const nameChanged = formData.userName !== initialUserData.userName;
    const passwordChanged = validatedPassword !== '';
  
    return emailChanged || nameChanged || passwordChanged;
  };

  const styleModifiedFields = () => {
    const modified = [];
    if (formData.userEmail !== initialUserData.userEmail) {
      modified.push("userEmail");
    }
    if (formData.userName !== initialUserData.userName) {
      modified.push("userName");
    }
    if (validatedPassword !== '') {
      modified.push("password");
    }
    setUpdatedFields(modified);
    setTimeout(() => setUpdatedFields([]), 5000);
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };
  
  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      token,
      ...formData,
    };
    validatedPassword !== "" ? payload.validatedPassword = validatedPassword : null;

    const { isValid, errors } = isFormValid(formData, password, confirmPassword);
    if (!isValid) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      setErrorMessage(firstError); // message global si tu veux l’afficher en haut
      return;
    } else {
      setFormErrors({}); // tout est bon, on efface les erreurs précédentes
      // Appel API
      try {
        // console.log("🔐 Token envoyé :", token); // ← vérifie le contenu exact
      
        if (!hasChanges()) {
          setSuccessMessage("Aucune modification détectée.");
          setTimeout(() => setSuccessMessage(''), 5000);
          return;
        }

        const response = await axios.post(getData(ROUTES.USER_UPDATE_ROUTE), payload);
      
        if (response.data) {
          console.log("✅ Réponse du serveur :", response.data);
          if (response.data.token) {
            const token = response.data.token;
            const user = getUserFromToken(token);
            if (user) {
              dispatch(setUser({ token, ...user }));
              setSuccessMessage("Vos informations ont bien été mises à jour !");
              setTimeout(() => setSuccessMessage(''), 5000);
              styleModifiedFields();
            } else {
              setErrorMessage("Token invalide.");
            }
          }
          if (response.data.alerts) {
            const alerts = response.data.alerts;
          
            if (alerts.email) {
              setFormErrors(prev => ({ ...prev, userEmail: alerts.email }));
            }
            if (alerts.password) {
              setFormErrors(prev => ({ ...prev, password: alerts.password }));
            }
            if (alerts.userName) {
              setFormErrors(prev => ({ ...prev, userName: alerts.userName }));
            }
          
            if (Object.keys(alerts).length > 0) {
              setErrorMessage("Certaines informations n'ont pas pu être modifiées.");
            }
          }
        }
        // setSuccessMessage('');
      } catch (error) {
        console.error("❌ Erreur API :", error.response?.data);
        setErrorMessage(error.response?.data?.error || 'Erreur lors de la connexion');
      }      
    }
  };

  return (
    <div className="user-page container">
      <div className="user-title">
        <div className="title-image-container">
          <img 
            src={getResource(RESOURCE_ROUTES.AVATAR_ROUTE, userImage ? formData.userImage : RESOURCE_ROUTES.DEFAULT_AVATAR)}
            alt="User Avatar" 
            className="title-avatar"
          />
        </div>
        <div className='title-name-container'>
          <p className='title-name'>{userName}</p>
        </div>
      </div>

      <form className="user-form" onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="form-group avatar-group">
          <label htmlFor="userimage">Avatar</label>
          <input type="file" id="userimage" name="userimage" className="input-file" />
          
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            className={`input-field
              ${formErrors.userName ? 'input-error' : ''}
              ${updatedFields.includes("userName") ? 'input-success' : ''}
              `}
          />
          {formErrors.userName && (
            <p className="error-message">{formErrors.userName}</p>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Adresse email</label>
          <input
            type="email"
            id="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            className={`input-field
              ${formErrors.userEmail ? 'input-error' : ''}
              ${updatedFields.includes("userEmail") ? 'input-success' : ''}
              `}
          />
          {formErrors.userEmail && (
            <p className="error-message">{formErrors.userEmail}</p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="form-group" id="pwd-group">
          <label htmlFor="password">Mot de passe</label>
          <div className="input-valid">
            <input
              type="password"
              id="password"
              name="password"
              className="input-field"
              onChange={handlePasswordChange}
            />
            <span className="pwd-check-icon" id="pwd-valid">&#10003;</span> {/* coche pour mot de passe */}
          </div>
          <div className="password-rules" id="password-rules">
            {renderPasswordRules(password)}
          </div>
        </div>

        {/* Confirmation */}
        <div className="form-group" id="pwd-check">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <div className="input-valid">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input-field"
              value={confirmPassword}
              onChange={handleConfirmChange}
            />
            <span className="pwd-confirm-icon" id="pwd-confirm">&#10003;</span> {/* coche pour confirmation */}
          </div>
        </div>

        <button type="submit" className="submit-btn">Enregistrer</button>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </form>
    </div>

  )
}

export default UserPage