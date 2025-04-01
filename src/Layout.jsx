import React, { useEffect} from 'react'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { Outlet } from 'react-router-dom'
import './styles/Layout.css'
import { setUser, logout } from './store/actions/auth'
import { initUserFromStorage } from './utility/initUserFromStorage';
import { useAppSelector,  useAppDispatch } from './store/reducers/store'
import { useDispatch } from 'react-redux';  // Importer dispatch de Redux
import { getTokenRemainingTime, refreshToken } from './utility/jwtUtils'
import { useNavigate, useLocation } from 'react-router-dom'


const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // des le lancement de l'app, inscrire les données User dans le storage
    const userData = initUserFromStorage();
    if (userData) {
      dispatch(setUser(userData));
    }
  
    // 🔁 Vérifier toutes les 3 heures la validité du token user
    const intervalId = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const remaining = getTokenRemainingTime(token);
  
      if (remaining <= 0) { // Si le token est expiré, logout et vider le storgae
        dispatch(logout());  // Déconnecter l'utilisateur en envoyant l'action logout au store Redux
          if (location.pathname.includes("/user")) {
              navigate("/");  // Rediriger vers la page d'accueil si l'utilisateur est sur une page réservée
          }
      } else if (remaining > 0 && remaining < 86400) { // si le token expire dans moins d'un jour
        const newToken = await refreshToken(token); // envoyer une demande de refresh au backend
        if (newToken) {
          localStorage.setItem("token", newToken); // inscrire les données du nouveau token dans le storage
  
          const updatedUser = initUserFromStorage();
          if (updatedUser) {
            dispatch(setUser(updatedUser));
          }
        }
      }
    }, 3 * 60 * 60 * 1000); // toutes les 3 heures
    
    const adjustMainPadding = () => {
      const header = document.getElementById("site-header");
      const footer = document.getElementById("site-footer");
      const main = document.getElementById("main-content");
  
      if (header && footer && main) {
        main.style.paddingTop = `${header.offsetHeight}px`;
        main.style.paddingBottom = `${footer.offsetHeight}px`;
      }
    };
  
    window.addEventListener("load", adjustMainPadding);
    window.addEventListener("resize", adjustMainPadding);
    adjustMainPadding(); // initial call
  
    return () => {
      window.removeEventListener("load", adjustMainPadding);
      window.removeEventListener("resize", adjustMainPadding);
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div className="app-layout">
      <HeaderComponent />
      <main className="page-content" id='main-content'>
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  )
}

export default Layout
