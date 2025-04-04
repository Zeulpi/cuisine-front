import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/reducers/store";
import { setUser } from "../../store/actions/auth";
import { getUserFromToken } from "../../utility/getUserFromToken";
import { getData } from "../../resources/api-constants";
import { ROUTES } from "../../resources/routes-constants";
import UserForm from "../../components/UserForm";
import axios from "axios";

const UserPage = () => {
  const { token, userEmail, userImage, userName } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // État pour messages & styles
  const [successMessage, setSuccessMessage] = useState('');
  const [updatedFields, setUpdatedFields] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [resetImageTrigger, setResetImageTrigger] = useState(false);
  const [awaitingServResponse, setAwaitingServResponse] = useState(false);

  const initialUserData = {
    userEmail,
    userName,
  };

  // Verifier si des champs ont changé
  const hasChanges = (formData, validatedPassword = "", imageModified = false) => {
    return (
      formData.userName !== userName ||
      formData.userEmail !== userEmail ||
      validatedPassword !== '' ||
      imageModified
    );
  };
  // Fonction de style des champs modifiés
  const styleModifiedFields = (formData, validatedPassword) => {
    const modified = [];
    if (formData.userEmail !== initialUserData.userEmail) {
      modified.push("userEmail");
    }
    if (formData.userName !== initialUserData.userName) {
      modified.push("userName");
    }
    if (validatedPassword !== "") {
      modified.push("password");
    }
    setUpdatedFields(modified);
    setTimeout(() => setUpdatedFields([]), 5000);
  };

  // Soumission personnalisée
  const handleUserUpdate = async (formData) => {
    setAwaitingServResponse(true);
    // On extrait le password pour le transmettre à styleModifiedFields (mais on garde tout dans formData)
    const validatedPassword = formData.get("validatedPassword") || "";
    const imageFile = formData.get("userImage");
    const imageModified = imageFile && imageFile.name;
    const dataToSend = {
      userName: formData.get("userName"),
      userEmail: formData.get("userEmail"),
    };
  
    // Ajoute le token dans le FormData si absent
    if (!formData.has("token")) {
      formData.append("token", token);
    }
  
    // Empêche l’envoi si aucune modification
    if (!hasChanges(dataToSend, validatedPassword, imageModified)) {
      setSuccessMessage("Aucune modification détectée.");
      setTimeout(() => setSuccessMessage(''), 5000);
      return;
    }
  
    try {
      const response = await axios.post(getData(ROUTES.USER_UPDATE_ROUTE), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data?.token) {
        const newToken = response.data.token;
        const user = getUserFromToken(newToken);
  
        if (user) {
          dispatch(setUser({ token: newToken, ...user }));
          setSuccessMessage("Vos informations ont bien été mises à jour !");
          styleModifiedFields(dataToSend, validatedPassword);
          setTimeout(() => setSuccessMessage(''), 5000);
          setResetImageTrigger(prev => !prev);
        }
      }
  
      if (response.data?.alerts && Object.keys(response.data.alerts).length > 0) {
        const alerts = response.data.alerts;
        console.warn("⚠️ Alertes du serveur :", alerts);
        setFormErrors(alerts);
      }
  
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
    } finally {
      setAwaitingServResponse(false);
    }
  };
  

  return (
    <div className="user-page container">
      <UserForm
        onSubmit={handleUserUpdate}
        buttonText="Mettre à jour mes infos"
        successMessage={successMessage}
        defaultValues={{
          userName,
          userEmail,
          userImage,
        }}
        updatedFields={updatedFields}
        formErrors={formErrors}
        onValidationError={setFormErrors}
        resetImageTrigger={resetImageTrigger}
        isEditMode={true}
        awaitingServResponse={awaitingServResponse}
      />
    </div>
  );
};

export default UserPage;
