import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sanitizeHtml } from '../../utility/domUtils';
import { faClock, faDollarSign, faStar } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Recipes/RecipeStepComponent.css';

export default function RecipeStepComponent({ order, total, description, time, timeUnit, simult, operations, ingredients }) {
  return (
    <div className="step-container">
      <div className='step-header'>
        <div className="step-title">
            <span>Etape {order}/{total} </span>
        </div>
        <div className="step-time">
            <span><FontAwesomeIcon icon={faClock} className="icon icon-clock" /> {time} {timeUnit}</span>
        </div>
      </div>
      <div className='step-detail'>
        {Object.entries(operations).length > 0 && (
          <div className='step-operations'>
            <div className='step-operation-list'>
              {Object.entries(operations).map(([opId, operation]) => (
                <span key={opId} className='step-operation-item'>
                  <div className='step-operation-action'>
                    <span>{operation.operation}</span>
                    <span>{operation.ingredient && <span className={`step-ingredient ${operation.ingredient < 0 ? 'intermediate-ingredient' : 'base-ingredient'}`}> {ingredients[operation.ingredient].name}</span>}</span>
                  </div>
                  <div className='step-operation-result'>
                    {operation.resultId &&(
                      <p>resultat : {operation.resultId && <span className='step-result intermediate-ingredient'> {ingredients[operation.resultId].name}</span>}</p>
                    )}
                  </div>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className='step-description'>
          <span style={{ whiteSpace: 'pre-line' }}>
            {sanitizeHtml(description)}
          </span>
        </div>
      </div>
    </div>
  );
}

RecipeStepComponent.propTypes = {
  order: PropTypes.number,
  total: PropTypes.number,
  description: PropTypes.string,
  time: PropTypes.number,
  timeUnit: PropTypes.string,
  simult: PropTypes.bool,
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      operation: PropTypes.string.isRequired,
      ingredient: PropTypes.number,
      resultId: PropTypes.number,
    })
  ),
  ingredients: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
};