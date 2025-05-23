import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../resources/api-constants';
import { ROUTES } from '../resources/routes-constants';
import { useAppSelector } from '../store/reducers/store';
import UserForm from '../components/UserForm';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [awaitingServResponse, setAwaitingServResponse] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleRegister = async (formData) => {
    setAwaitingServResponse(true);
    
    try {
      const response = await axios.post(getData(ROUTES.REGISTER_ROUTE), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        navigate("/", {
          state: {
            openLoginModal: true,
            prefillEmail: formData.get("userEmail"),
          }
        });
      }

      if (response.data.alerts) {
        setFormErrors(response.data.alerts);
        const first = Object.values(response.data.alerts)[0];
        setErrorMessage(first);
      }

    } catch (error) {
      console.error(" Erreur API :", error);
      setErrorMessage(error.response?.data?.error || "Erreur inconnue");
    } finally {
      setAwaitingServResponse(false);
    }
  };

  return (
    <div className="user-page container">
      <h2>Créer un compte</h2>
      {errorMessage && <p className="error-message global-error">{errorMessage}</p>}

      <UserForm
        onSubmit={handleRegister}
        buttonText="S'inscrire"
        formErrors={formErrors}
        onValidationError={setFormErrors}
        successMessage=""
        requireCaptcha={true}
        awaitingServResponse={awaitingServResponse}
      />
    </div>
  );
};

export default Register;
