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


export function CardComponent({ isModal = false, cardWidth='100%', cardName=null, cardImg=null, cardCursor="help", cardDescription = null, cardFooter=null, children = null, childrenFooter=null, childrenTarget=null, handleRemove=null, handleClickContent=null, handleClickImg=null, handleMouseOver=null, handleMouseOut=null, handleFuncOne=null, handleFuncTwo=null }) {
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);
  const bgImage = cardImg || '';

  useEffect(()=>{
    // console.log(children);
  }, [children]);

  const handleRemoveClick = (e) => {
    handleRemove(e);
  }

  return (
    <>
      <div className="basic-card" style={{ '--basic-card-width': cardWidth }} >
        {children && !childrenTarget ?
          (children) :
          (
            <>
              {handleRemove && (
                <button className='card-remove' style={{display: (isModal) ? 'block' : 'none'}} onClick={(e)=>{handleRemoveClick(e)}}>X</button>
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
                  <div className={(children) ? 'children-body' : 'card-description'}>
                    {children && childrenTarget.includes('body') ?
                      children :
                      cardDescription
                    }
                  </div>

                  {cardImg && (
                    <img className='card-background'
                      src={bgImage} alt=""
                      onClick={handleClickImg}
                      style={{cursor: (isModal) ? 'pointer' : 'var(--card-cursor)'}}
                    />
                  )}
                </div>
                
                <div className="card-footer" style={{padding: childrenFooter ? '5px' : '8px'}}>
                  <div className={'footer-content'}>
                    {childrenFooter ?
                      childrenFooter :
                      cardFooter
                    }
                  </div>
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
  childrenFooter: PropTypes.node,
  childrenTarget: PropTypes.string,
  handleRemove:PropTypes.func,
  handleClickContent:PropTypes.func,
  handleClickImg:PropTypes.func,
  handleMouseOver:PropTypes.func,
  handleMouseOut:PropTypes.func,
  handleFuncOne:PropTypes.func,
  handleFuncTwo:PropTypes.func,
};