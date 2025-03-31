import React, { useEffect } from "react";
import { useAppSelector } from "../../../store/reducers/store"; // Importer le hook pour accéder au store Redux
import { useNavigate } from "react-router-dom"; // Importer useNavigate pour la navigation

const Register = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn); // Vérifier si l'utilisateur est connecté
  const navigate = useNavigate(); // Utiliser le hook useNavigate pour la redirection

  // Redirection immédiate si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");  // Rediriger vers la page d'accueil
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;  // Ne pas afficher le formulaire de connexion si déjà connecté
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
