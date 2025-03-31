import React, { useState} from "react";
import { useAppSelector, useAppDispatch } from "../../store/reducers/store";
import { logout } from "../../store/actions/auth";
import LoginModal from "./Login/LoginModal";
import { RESOURCE_ROUTES } from './../../resources/routes-constants';
import { getResource } from './../../resources/back-constants';
import './../../styles/login.css';
import './../../styles/Header/user.css'
import { Link } from "react-router-dom"; // Importer Link pour la navigation
import { useNavigate, useLocation } from "react-router-dom";

const LoginComponent = () => {
    const { userEmail, userImage, isLoggedIn } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();  // Récupérer dispatch pour envoyer des actions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
    const location = useLocation(); // Récupérer l'URL actuelle de la page

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Fonction pour se déconnecter
      const handleLogout = () => {
        dispatch(logout());  // Déconnecter l'utilisateur en envoyant l'action logout au store Redux
        if (location.pathname.includes("/user")) {
            navigate("/");  // Rediriger vers la page d'accueil si l'utilisateur est sur une page réservée
        }
      };

    return (
        <>
            {isLoggedIn ? (
                <div className="log-info">
                    <Link to="user/account">
                    <div className="user-image" id="logged-avatar">
                        <img 
                            src={getResource(RESOURCE_ROUTES.AVATAR_ROUTE, userImage ? userImage : RESOURCE_ROUTES.DEFAULT_AVATAR)}
                            alt="User Avatar" 
                            className="user-avatar"
                            style={{cursor: "pointer"}}
                        />
                    </div>
                    </Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button> {/* Bouton Logout */}
                </div>
            ) : (
                // Sinon, afficher le bouton Login
                <div className="log-info">
                <button onClick={toggleModal} className="login-btn">Login</button>
                </div>
            )}

            {/* Modale de connexion */}
            <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
        </>
    );
};

export default LoginComponent;