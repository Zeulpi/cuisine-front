import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Recipes/RecipeComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getResource } from '../../resources/back-constants';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants';

const DEFAULT_IMAGE = '/images/default-recipe.jpg';

export default function RecipeComponent({ name, image, duration, tags }) {
    const isDefaultImage = !image;
    const bgImage = isDefaultImage
  ? getResource(RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE, RESOURCE_ROUTES.DEFAULT_RECIPE_IMAGE)
  : getResource(RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE, image);

  return (
    <div className="recipe-card">
        <div
            className={`recipe-background ${isDefaultImage ? 'default-background' : ''}`}
            style={{ backgroundImage: `url(${bgImage})` }}
        />

        <div className="recipe-content">
            <div className="recipe-header">
                {name}
            </div>

            <div className="recipe-footer">
                <div className="recipe-duration">
                    <FontAwesomeIcon icon={faClock} className="icon-clock" />
                    <span>{duration?.value} {duration?.unit}</span>
                </div>

                <div className="recipe-tags">
                    {tags?.map((tag, index) => (
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
            </div>
        </div>
    </div>
  );
}

RecipeComponent.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  duration: PropTypes.shape({
    value: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired
  }).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  )
};

function getTextColor(bgColor) {
  if (!bgColor) return '#000';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 160 ? '#000' : '#fff';
}
