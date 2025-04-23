import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import '../styles/BaseModal.css'

export const BaseModal = ({ isOpen, onClose, children, cardWidth }) => {
  useEffect(() => { // Ajustement dynamique de la position verticale de la modale
    const adjustModalOffset = () => {
      const header = document.getElementById("app-header");
      const footer = document.getElementById("app-footer");
      const modale = document.getElementById("modal-body"); // Sélectionner la modale

      if (header && footer && modale) {
        modale.style.top = `${header.offsetHeight + 20}px`;
        modale.style.bottom = `${footer.offsetHeight + 20}px`;
      }
    };
  
    window.addEventListener("load", adjustModalOffset);
    window.addEventListener("resize", adjustModalOffset);
    adjustModalOffset(); // initial call
  
    return () => {
      window.removeEventListener("load", adjustModalOffset);
      window.removeEventListener("resize", adjustModalOffset);
    };
  }, [isOpen]);

  useEffect(() => {
    // Lorsque la modale est ouverte, désactive le défilement du body
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Désactive le défilement du body
    } else {
      document.body.style.overflow = 'auto';  // Réactive le défilement du body
    }

    // Nettoyage du style lorsque la modale est fermée
    return () => {
      document.body.style.overflow = 'auto'; // Toujours réactiver le défilement du body à la fermeture de la modale
    };
  }, [isOpen]);

  if (!isOpen) return null;  // Ne rien afficher si la modale n'est pas ouverte

  return (
    <div className="base-modal-overlay" id='modal-frame' >
      <div className='base-modal-body' id='modal-body' style={{ '--card-width': '50vw' }}>
        {children}
      </div>
    </div>
  );
};

// Validation des props
BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  cardWidth: PropTypes.string,
};