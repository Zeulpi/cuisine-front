import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import CardComponent from '../Utils/CardComponent.jsx';
import { useNavigate, useLocation } from 'react-router';
import { slugify } from '../../utility/slugify.js';
import { getTextColor } from '../../utility/getTextColor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getResource } from '../../resources/back-constants.js';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants.js';
import '../../styles/Recipes/RecipeCardComponent.css';


export default function RecipeCardComponent({ recipe, isModal = false, isExpired=false, cardWidth='100%', chooseMeal=null, chooseDay=null, addRecipe=null, removeKey= null, dataName=null, dataKey=null, localPortions=null }) {
  const navigate = useNavigate();
  const [newPortions, setNewPortions] = useState(localPortions || recipe?.portions || 1); // Si on vient de la card, on prend les portions de la card
  const [firstRender, setFirstRender] = useState(true);
  const rImage = recipe?.image;
  const isDefaultImage = !rImage;
  const bgImage = getResource(
      RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE,
      isDefaultImage ? RESOURCE_ROUTES.DEFAULT_RECIPE_IMAGE : encodeURIComponent(rImage)
    );

  const handleportions = (e) => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case 'portions-up':
        if (newPortions < 20) {
          setNewPortions(newPortions + 1);
        } else {
          setNewPortions(20);
        }
        break;
      case 'portions-down':
        if (newPortions > 1) {
          setNewPortions(newPortions - 1);
        } else {
          setNewPortions(1);
        }
        break;
      default:
        break;
    }
  };

  useEffect(()=>{
    // console.log(removeKey, isExpired);
  }, [isExpired])

  useEffect(() => { // Quand les portions changent (avec les boutons - et +), on appelle addRecipe pour modifier la recette dans le planner (sauf au 1er render)
    if (!firstRender) {
      // console.log(dataKey, newPortions);
      addRecipe(dataKey, recipe, newPortions); // On ajoute la recette au planner
    }
    setFirstRender(false);
  }, [newPortions]);

  const handleClick = (recipe, key = null) => {
    if (!isModal) { // vrai si on est sur la page RecipeList
      navigate(`/recipes/${(recipe.id)}-${slugify(recipe.name)}`);
      // console.log(recipe.id, slugify(recipe.name));
      
    } else {
      if (chooseMeal && key === null) { // vrai si on ajoute une recette au planner (click depuis le div, modale ouverte avec bouton '+')
        if (chooseDay && dataName && dataKey) { // vrai si on clique sur la Card dans le planner
          // console.log("chooseDay is defined", dataName, dataKey);
          // console.log(recipe.id, slugify(recipe.name));
          navigate(`/recipes/${recipe.id}-${slugify(recipe.name)}`, {
            state: { portionsFromCard: newPortions },
          });
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
      <CardComponent cardWidth={cardWidth}>
      <>
        {!isExpired && isModal && (
          <button className='recipe-remove' style={{display: (isModal && removeKey) ? 'block' : 'none'}} onClick={() => {(isModal && removeKey) ?handleClick(recipe, removeKey):null}}>X</button>
        )}
        
        <div className="recipe-content"
          onClick={() => {(isModal && chooseDay && dataName && dataKey) ? null : handleClick(recipe)}}
          data-id={recipe.id}
          style={{cursor: (isModal && chooseDay && dataName && dataKey) ? 'default' : 'pointer'}}
        >
          <div className="recipe-header">
            {recipe.name}
          </div>
          <img className={`recipe-background ${isDefaultImage ? 'default-background' : ''}`}
            src={bgImage} alt=""
            onClick={() => {(isModal && chooseDay && dataName && dataKey) ? handleClick(recipe) : null}}
            style={{cursor: (isModal && chooseDay && dataName && dataKey) ? 'pointer' : 'var(--card-cursor)'}}
          />
          <div className="recipe-footer">
            {(isModal && chooseDay && dataName && dataKey && !isExpired) ?
              (
                <>
                <div><button id='portions-down' onClick={handleportions}>-</button>portions : {newPortions}<button id='portions-up' onClick={handleportions}>+</button></div>
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
      </>
      </CardComponent>
    )}
    </>
  );
}

RecipeCardComponent.propTypes = {
  recipe: PropTypes.object,
  isModal: PropTypes.bool,
  isExpired: PropTypes.bool,
  cardWidth: PropTypes.string,
  chooseMeal: PropTypes.func,
  chooseDay: PropTypes.func,
  addRecipe: PropTypes.func,
  removeKey: PropTypes.string,
  dataName: PropTypes.string,
  dataKey: PropTypes.string,
  localPortions: PropTypes.number,
};