import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import LoadingComponent from '../Utils/loadingComponent';
import {RecipeList} from '../../pages/RecipeList';
import '../../styles/User/RecipeModal.css'

export function RecipeModal({ isOpen, onClose, dayChoice = '', chooseDay, cardWidth, chooseMeal }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef();

  return (
    <>
      <div className='recipe-modal-title'>
        <h2 className='modal-title'>Choisissez une recette pour {dayChoice}</h2>
        <button className="recipe-close-btn" onClick={() =>{ chooseDay();}} tabIndex={5}>X</button>
      </div>
      <div className="recipe-modal-content" onClick={(e) => e.stopPropagation()} id='recipe-modal' style={{ '--card-width': cardWidth }}>
        <RecipeList isModal={true} cardWidth={cardWidth} ref={listRef} chooseMeal={chooseMeal} />
        {errorMessage && <p>{errorMessage}</p>}
        <LoadingComponent loading={loading} loadingText="Connecting ..." />
      </div>
    </>
  );
}

// Validation des props
RecipeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  dayChoice: PropTypes.string,
  chooseDay: PropTypes.func,
  cardWidth: PropTypes.string,
  chooseMeal: PropTypes.func,
};