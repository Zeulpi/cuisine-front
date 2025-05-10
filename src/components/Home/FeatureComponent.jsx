import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router';
import { getResource } from '../../resources/back-constants.js';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants.js';
import '../../styles/Home/FeatureComponent.css';


export default function FeatureComponent({ cardName=null, isModal = false, cardImg=null, cardCursor="help", cardDescription = null }) {
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);
  const cardImage = cardImg;
  const isDefaultImage = !cardImage;
  const bgImage = isDefaultImage
  ? getResource(RESOURCE_ROUTES.GLOBAL_IMAGE_ROUTE, RESOURCE_ROUTES.DEFAULT_FEATURE_IMAGE)
  : getResource(RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE, encodeURIComponent(cardImage));


  const handleHover = (event) => {
    const card = event.currentTarget;
    event.stopPropagation();
    const cardDescription = card.querySelector('.card-description');
    if (cardDescription) {
      cardDescription.style.display = 'flex'; // change le display en 'flex'
    }
  };
  const handleMouseOut = (event) => {
    const card = event.currentTarget;
    event.stopPropagation();
    const cardDescription = card.querySelector('.card-description'); // sélectionne l'élément .card-description
    if (cardDescription) {
      cardDescription.style.display = 'none'; // réinitialise le display en 'none'
    }
  };

  const handleClick = () => {
    // console.log("handle click");
  };

  return (
    <>
        {isModal && (
          <button className='card-remove' style={{display: (isModal) ? 'block' : 'none'}} onClick={() => {(isModal) ?handleClick():null}}>X</button>
        )}
        
      <div className="card-content"
        onClick={() => {(isModal) ? null : handleClick()}}
        style={{'--basic-card-cursor': (isModal) ? 'default' : cardCursor}}
      >
        <div className="card-header">
          {cardName}
        </div>
        <div className='card-body' onMouseOver={handleHover} onMouseOut={handleMouseOut}>
          <img className={`card-background ${isDefaultImage ? 'default-card-background' : ''}`}
            src={bgImage} alt=""
            onClick={() => {(isModal) ? handleClick() : null}}
            style={{cursor: (isModal) ? 'pointer' : 'var(--card-cursor)'}}
          />
          <div className='card-description'>{cardDescription}</div>
        </div>
        
        <div className="card-footer">
          {(isModal) ?
            (
              <>
              <div className="card-footer-modal">
                <span></span>
              </div>
              </>
            ) : (
              <>
              <div className="card-footer-nomodal">
                <span></span>
              </div>
              </>
            )}
        </div>
      </div>
    </>
  );
}

FeatureComponent.propTypes = {
  cardName: PropTypes.string,
  isModal: PropTypes.bool,
  cardWidth: PropTypes.string,
  cardImg: PropTypes.string,
  cardCursor: PropTypes.string,
  cardDescription: PropTypes.string,
};