import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router';
import { slugify } from '../../utility/slugify.js';
import { getTextColor } from '../../utility/getTextColor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getResource } from '../../resources/back-constants.js';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants.js';
import '../../styles/Recipes/RecipeCardComponent.css';


export default function RecipeCardComponent({ recipe, isModal = false, cardWidth='100%', chooseMeal=null, chooseDay=null, removeKey= null, dataName=null, dataKey=null }) {
  const navigate = useNavigate();

  const rImage = recipe?.image;
  const isDefaultImage = !rImage;
  const bgImage = isDefaultImage
  ? getResource(RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE, RESOURCE_ROUTES.DEFAULT_RECIPE_IMAGE)
  : getResource(RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE, encodeURIComponent(rImage));

  const handleClick = (recipe, key = null) => {
    // Si on est sur la page RecipeList, on navigue.
    // console.log(recipe, key);
    
    if (!isModal) { // vrai si on est sur la page RecipeList
      navigate(`/recipes/${(recipe.id)}-${slugify(recipe.name)}`);
      // console.log(isModal, 'on navigue');
    } else {
      if (chooseMeal && key === null) { // vrai si on ajoute une recette au planner (click depuis le div, modale ouverte avec bouton '+')
        if (chooseDay && dataName && dataKey) { // vrai si on clique sur le la Card dans le planner
          // console.log("chooseDay is defined", dataName, dataKey);
          navigate(`/recipes/${(recipe.id)}-${slugify(recipe.name)}`);
          // chooseMeal(recipe, dataKey);  // On retire la recette de l'horaire
          // chooseDay(dataName, dataKey); //on ouvre la modale de selection de la recette
        } else {
          chooseMeal(recipe, null, recipe.portions); // On Ajoute la recette au planner
        }
      } else if(chooseMeal && key) { // vrai si on retire une recette du planner
        chooseMeal(recipe, key) // On retire la recette du planner
      } else {
        console.log("chooseMeal is not defined");
      }
    }
  };

  return (
    <>
    {recipe && (
      <div className="recipe-card" style={{ '--card-width': cardWidth }} >
        <><button className='recipe-remove' style={{display: removeKey ? 'block' : 'none'}} onClick={() => {removeKey ?handleClick(recipe, removeKey):null}}>X</button></>
        <div className="recipe-content"
          onClick={() => {(chooseDay && dataName && dataKey) ? null : handleClick(recipe)}}
          data-id={recipe.id}
          style={{cursor: (chooseDay && dataName && dataKey) ? 'default' : 'pointer'}}
        >
          <div className="recipe-header">
            {recipe.name}
          </div>
          <img className={`recipe-background ${isDefaultImage ? 'default-background' : ''}`}
            src={bgImage} alt=""
            onClick={() => {(chooseDay && dataName && dataKey) ? handleClick(recipe) : null}}
            style={{cursor: (chooseDay && dataName && dataKey) ? 'help' : 'var(--card-cursor)'}}
          />
          <div className="recipe-footer">
            {(chooseDay && dataName && dataKey) ?
              (
                <>
                <div><button>-</button>portions : {recipe.portions}<button>+</button></div>
                </>
              ) : (
                <>
                <div className="recipe-duration">
                <FontAwesomeIcon icon={faClock} className="icon-clock" />
                <span>{recipe.duration?.value} {recipe.duration?.unit}</span>
                </div>
                <div className="recipe-tags">
                    {recipe.tags?.map((tag, index) => (
                        <span
                        key={index}
                        className="recipe-tag"
                        style={{
                            backgroundColor: tag.color,
                            color: getTextColor(tag.color)
                        }}
                        >
                        {tag.name}
                        </span>
                    ))}
                </div>
                </>
              )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

RecipeCardComponent.propTypes = {
  recipe: PropTypes.object,
  isModal: PropTypes.bool,
  cardWidth: PropTypes.string,
  chooseMeal: PropTypes.func,
  chooseDay: PropTypes.func,
  removeKey: PropTypes.string,
  dataName: PropTypes.string,
  dataKey: PropTypes.string,
};