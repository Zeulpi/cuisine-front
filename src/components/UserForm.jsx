import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../store/reducers/store';
import { getResource } from '../resources/back-constants';
import { RESOURCE_ROUTES } from '../resources/routes-constants';
import {
  updatePasswordRulesUI,
  isPasswordValid,
  isAllPassValid,
  renderPasswordRules,
  isFormValid
} from '../utility/formValidation';
import PropTypes from 'prop-types';
import '../styles/User/userForm.css'

const UserForm = ({ onSubmit, buttonText = "Enregistrer", defaultValues = {}, successMessage, updatedFields = [], formErrors = {}, onValidationError, resetImageTrigger = false, isEditMode, requireCaptcha, awaitingServResponse }) => {
  const { userName, userImage, userEmail } = useAppSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validatedPassword, setValidatedPassword] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const recaptchaRef = useRef(null);
  const [recaptchaRendered, setRecaptchaRendered] = useState(false);

  const [formData, setFormData] = useState({
    userName: defaultValues.userName || '',
    userEmail: defaultValues.userEmail || '',
    userImage: defaultValues.userImage || '',
  });
  
  useEffect(() => {
    if (!requireCaptcha || recaptchaRendered || !recaptchaRef.current) return;
    const interval = setInterval(() => {
      if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
        try {
          window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.REACT_APP_GRECAPTCHA_SITE_KEY,
          });
          setRecaptchaRendered(true);
          clearInterval(interval);
        } catch (e) {
          console.warn("⚠️ reCAPTCHA already rendered, skipping.");
          clearInterval(interval);
        }
      }
    }, 800);
    return () => clearInterval(interval);
  }, [requireCaptcha, recaptchaRendered]);
  
  useEffect(() => {
    if (resetImageTrigger) {
      // Réinitialise l’image locale (preview + file)
      setImagePreview(null);
      setImageFile(null);
      const input = document.getElementById("userimage");
      if (input) input.value = null;
  
      // ⏫ Met à jour formData.userImage avec l'image "officielle"
      setFormData((prev) => ({
        ...prev,
        userImage: defaultValues.userImage || '',
      }));
    }
  }, [resetImageTrigger]);

  useEffect(() => {
    updatePasswordRulesUI(password);
    const pwdCheck = document.getElementById("pwd-valid");
    const confirmCheck = document.getElementById("pwd-confirm");

    const rulesOk = isPasswordValid(password);
    if (pwdCheck) pwdCheck.style.display = password !== '' && rulesOk ? "inline" : "none";

    const allValid = isAllPassValid(password, confirmPassword);
    if (confirmCheck) confirmCheck.style.display = allValid ? "inline" : "none";

    setValidatedPassword(allValid ? password : '');
  }, [password, confirmPassword]);

  useEffect(() => {
    const imageModified = imageFile !== null;
    const hasChanged =
      formData.userName !== defaultValues.userName ||
      formData.userEmail !== defaultValues.userEmail ||
      validatedPassword !== '' ||
      imageModified;
    setCanSubmit(hasChanged);
  }, [formData, validatedPassword, imageFile, defaultValues]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      // Vérification facultative : type MIME et taille
      if (!file.type.startsWith("image/")) {
        console.warn("Fichier non valide : ce n'est pas une image.");
        return;
      }
  
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePreview = () => {
    setImagePreview(null);
    setImageFile(null);
    document.getElementById('userimage').value = null;
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Le preventDefault est ici, pas dans le onSubmit externe
    const { isValid, errors } = isFormValid(formData, password, confirmPassword);
    if (!isValid) {
        onValidationError?.(errors); // ↩ envoie les erreurs au parent
        return;
    }
    const formPayload = new FormData();
    formPayload.append("userEmail", formData.userEmail);
    formPayload.append("userName", formData.userName);
    if (validatedPassword !== "") {
        formPayload.append("validatedPassword", validatedPassword);
    }
    if (imageFile) {
        formPayload.append("userImage", imageFile); // ici on envoie le fichier binaire
    }
    if (requireCaptcha) {
        const captchaToken = window.grecaptcha?.getResponse();
        if (!captchaToken) {
          onValidationError?.({ captcha: "Veuillez valider le captcha" });
          return;
        }
        formPayload.append("captchaToken", captchaToken);
    }
    onSubmit(formPayload); // On appelle le handler personnalisé avec les données, pas l'event
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="user-title">
        <div className="title-image-container">
        <img 
            src={getResource(RESOURCE_ROUTES.AVATAR_ROUTE, formData.userImage || RESOURCE_ROUTES.DEFAULT_AVATAR)}
            alt="User Avatar" 
            className="title-avatar"
        />
        </div>
        <div className='title-name-container'>
          <p className='title-name'>{userName}</p>
        </div>
      </div>

      <div className="form-group avatar-group">
        <div className='avatar-upload-container'>
            <div className='avatar-input-container'>
                <label htmlFor="userimage">Avatar</label>
                <input type="file"
                    id="userimage"
                    name="userimage"
                    className="input-file"
                    onChange={handleImageChange}
                />
            </div>
            <div className="avatar-preview-wrapper">
            {imagePreview && (
                <>
                    <div className="title-image-container avatar-preview-container">
                    <img src={imagePreview} alt="Uploaded Avatar" className="title-avatar" />
                    </div>
                    <button className="remove-preview-btn" onClick={handleRemovePreview}>X</button>
                </>
            )}
            </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
          className={`input-field
            ${formErrors.userName ? 'input-error' : ''}
            ${updatedFields.includes("userName") ? 'input-success' : ''}
            `}
        />
        {formErrors.userName && <p className="error-message">{formErrors.userName}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Adresse email</label>
        <input
          type="email"
          name="userEmail"
          value={formData.userEmail}
          onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
          className={`input-field
            ${formErrors.userEmail ? 'input-error' : ''}
            ${updatedFields.includes("userEmail") ? 'input-success' : ''}
            `}
        />
        {formErrors.userEmail && <p className="error-message">{formErrors.userEmail}</p>}
      </div>

      <div className="form-group" id="pwd-group">
        <label htmlFor="password">Mot de passe</label>
        <div className="input-valid">
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="pwd-check-icon" id="pwd-valid">&#10003;</span>
        </div>
        <div className="password-rules" id="password-rules">
          {renderPasswordRules(password)}
        </div>
      </div>

      <div className="form-group" id="pwd-check">
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <div className="input-valid">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="pwd-confirm-icon" id="pwd-confirm">&#10003;</span>
        </div>
      </div>

      {requireCaptcha && (
      <div className="form-group">
        <div
            ref={recaptchaRef}
        ></div>
      </div>
      )}

      <button type="submit" className="submit-btn" disabled={!canSubmit || awaitingServResponse}>{buttonText}</button>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {awaitingServResponse && (
        <div className="loading-overlay">
            <div className="spinner" />
        </div>
        )}
    </form>
  );
};

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  defaultValues: PropTypes.shape({
    userName: PropTypes.string,
    userEmail: PropTypes.string,
    userImage: PropTypes.string
  }),
  successMessage: PropTypes.string,
  updatedFields: PropTypes.arrayOf(PropTypes.string),
  formErrors: PropTypes.object,
  onValidationError: PropTypes.func,
  resetImageTrigger: PropTypes.bool,
  isEditMode: PropTypes.bool,
  requireCaptcha: PropTypes.bool,
  awaitingServResponse: PropTypes.bool,
};

UserForm.defaultProps = {
  buttonText: 'Enregistrer',
  defaultValues: {},
  updatedFields:[],
  isEditMode:false,
};

export default UserForm;
