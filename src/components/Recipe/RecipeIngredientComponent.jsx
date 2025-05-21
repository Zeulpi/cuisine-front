import React from 'react';
import PropTypes from 'prop-types';
import { getResource } from '../../resources/back-constants';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants';
import '../../styles/Recipes/RecipeIngredientComponent.css';


export default function RecipeIngredientComponent({ name, image, quantity, unit, ratio }) {
  const adjustedQuantity = quantity * ratio;  
  const displayQuantity = adjustedQuantity % 1 === 0 ? adjustedQuantity : Number(adjustedQuantity.toFixed(2));

  const isDefaultImage = !image;
    const bgImage = getResource(RESOURCE_ROUTES.INGREDIENT_IMAGE_ROUTE, isDefaultImage ? RESOURCE_ROUTES.DEFAULT_INGREDIENT_IMAGE : encodeURIComponent(image));

  return (
    <div className="ingredient-container">
      <div className="ingredient-title">
          <span>{name}</span>
      </div>
      
      <div className='ingredient-detail-card'>
        <div
            className={`ingredient-detail-background ${isDefaultImage ? 'default-background' : ''}`}
            style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>
      
      <div className="ingredient-quantity">
          <span>{displayQuantity}</span> &nbsp; <span>{unit}</span>
      </div>
    </div>
  );
}

RecipeIngredientComponent.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  quantity: PropTypes.number,
  unit: PropTypes.string,
  ratio: PropTypes.number,
};
RecipeIngredientComponent.defaultProps = {
  ratio: 1,
};