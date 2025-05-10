import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router';
import { slugify } from '../../utility/slugify.js';
import { getTextColor } from '../../utility/getTextColor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getResource } from '../../resources/back-constants.js';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants.js';
import '../../styles/Utils/CardComponent.css';


export default function CardComponent({ isModal = false, cardWidth='100%', cardName=null, cardImg=null, cardCursor="help", cardDescription = null, cardFooter=null, children = null, handleRemove=null, handleClickContent=null, handleClickImg=null, handleMouseOver=null, handleMouseOut=null, handleFuncOne=null, handleFuncTwo=null }) {
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);
  const bgImage = cardImg || '';

  return (
    <>
      <div className="basic-card" style={{ '--basic-card-width': cardWidth }} >
        {children ? 
          children :
          (
            <>
              {handleRemove && (
                <button className='card-remove' style={{display: (isModal) ? 'block' : 'none'}} onClick={handleRemove}>X</button>
              )}

              <div className="card-content"
                onClick={handleClickContent}
                style={{'--basic-card-cursor': (isModal) ? 'default' : cardCursor}}
              >
                {cardName &&
                  (
                    <div className="card-header">
                      {cardName}
                    </div>
                  )
                }
                <div className='card-body' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                  <img className='card-background'
                    src={bgImage} alt=""
                    onClick={handleClickImg}
                    style={{cursor: (isModal) ? 'pointer' : 'var(--card-cursor)'}}
                  />
                  <div className='card-description'>{cardDescription}</div>
                </div>
                
                <div className="card-footer">
                  {cardFooter &&
                    (
                      <>
                      <div className="card-footer">
                        <span>{cardFooter}</span>
                      </div>
                      </>
                    )
                  }
                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  );
}

CardComponent.propTypes = {
  isModal: PropTypes.bool,
  cardWidth: PropTypes.string,
  cardName: PropTypes.string,
  cardImg: PropTypes.string,
  cardCursor: PropTypes.string,
  cardDescription: PropTypes.string,
  cardFooter:PropTypes.string,
  children: PropTypes.node,
  handleRemove:PropTypes.func,
  handleClickContent:PropTypes.func,
  handleClickImg:PropTypes.func,
  handleMouseOver:PropTypes.func,
  handleMouseOut:PropTypes.func,
  handleFuncOne:PropTypes.func,
  handleFuncTwo:PropTypes.func,
};