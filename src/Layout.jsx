import React, { useEffect} from 'react'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import { Outlet } from 'react-router-dom'
import './styles/Layout.css'


const Layout = () => {
  useEffect(() => {
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
