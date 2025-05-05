import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';  // Validation des props
import { useAppSelector, useAppDispatch } from "../../store/reducers/store";
import { logout } from "../../store/actions/auth";
import { clearRecipes } from "../../store/actions/recipe";
import LoginModal from "./Login/LoginModal";
import { RESOURCE_ROUTES, baseUrl } from './../../resources/routes-constants';
import { getResource } from './../../resources/back-constants';
import { getRolesFromToken } from "../../utility/getUserFromToken";
import './../../styles/login.css';
import './../../styles/Header/login/user.css'
import { Link } from "react-router-dom"; // Importer Link pour la navigation
import { useNavigate, useLocation } from "react-router-dom";

const LoginComponent = ({ openLoginModal, prefillEmail }) => {
    const { token, userEmail, userImage, isLoggedIn } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();  // Récupérer dispatch pour envoyer des actions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
    const location = useLocation(); // Récupérer l'URL actuelle de la page
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (location.state?.openLoginModal) {
            toggleModal();
        }
    }, [location.state]);

    useEffect(() => {
        if (location.state?.prefillEmail) {
            setEmail(location.state.prefillEmail);
        }
    }, [location.state]);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Fonction pour se déconnecter
    const handleLogout = () => {
        dispatch(logout());  // Déconnecter l'utilisateur en envoyant l'action logout au store Redux
        dispatch(clearRecipes());  // Vider les recettes du storage
        if (location.pathname.includes("/user")) {
            navigate("/");  // Rediriger vers la page d'accueil si l'utilisateur est sur une page réservée
        }
    };

    const handleAdmin = () => {
        window.open(baseUrl+"/admin", "_blank")
    };

    return (
        <>
            {isLoggedIn ? (
                <div className="log-info">
                    <Link to="user/account">
                    <div className="logged-image" id="logged-avatar">
                        <img 
                            src={getResource(RESOURCE_ROUTES.AVATAR_ROUTE, userImage ? userImage : RESOURCE_ROUTES.DEFAULT_AVATAR)}
                            alt="User Avatar" 
                            className="user-avatar"
                            style={{cursor: "pointer"}}
                        />
                    </div>
                    </Link>
                    <div className="log-btns">
                        <button onClick={handleLogout} className="logout-btn">Logout</button> {/* Bouton Logout */}
                        { getRolesFromToken(token) && (
                            <button onClick={handleAdmin} className="admin-btn">Admin</button>
                        )
                        }
                    </div>
                </div>
            ) : (
                // Sinon, afficher le bouton Login
                <div className="log-info">
                <button onClick={toggleModal} className="login-btn">Login</button>
                </div>
            )}

            {/* Modale de connexion */}
            <LoginModal isOpen={isModalOpen} onClose={toggleModal} prefillEmail={email} />
        </>
    );
};
LoginComponent.propTypes = {
  openLoginModal: PropTypes.bool,
  prefillEmail: PropTypes.string,
};

export default LoginComponent;