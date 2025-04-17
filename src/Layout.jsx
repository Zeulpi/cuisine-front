import React, { useEffect} from 'react'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { Outlet } from 'react-router-dom'
import './styles/Layout.css'
import { useAppDispatch } from './store/reducers/store'
import { startTokenRefresh, stopTokenRefresh } from './utility/tokenManager'
import { useNavigate, useLocation } from 'react-router-dom'


const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { // Rafraichissement periodique du jwToken
    // Démarrer la vérification du token au lancement du composant
    const intervalId = startTokenRefresh(dispatch, navigate, location);
    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => stopTokenRefresh(intervalId);
  }, [dispatch, navigate, location]);

  useEffect(() => { // Ajustement dynamique de la hauteur des elements header/main/footer
    const adjustMainPadding = () => {
      const header = document.getElementById("app-header");
      const footer = document.getElementById("app-footer");
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
