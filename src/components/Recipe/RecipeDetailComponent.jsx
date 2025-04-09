import React from 'react';
import PropTypes from 'prop-types';
import { getTextColor } from '../../utility/getTextColor.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDollarSign, faStar } from '@fortawesome/free-solid-svg-icons';
import { getResource } from '../../resources/back-constants';
import { ROUTES, RESOURCE_ROUTES } from '../../resources/routes-constants';
import '../../styles/Recipes/RecipeDetailComponent.css';


export default function RecipeDetailComponent({ image, duration, tags }) {
    const isDefaultImage = !image;
    const bgImage = getResource(RESOURCE_ROUTES.RECIPE_IMAGE_ROUTE, isDefaultImage ? RESOURCE_ROUTES.DEFAULT_RECIPE_IMAGE : encodeURIComponent(image));

  return (
    <div className="recipe-intro-frame">
        <div className='recipe-detail-infos'>
          <div className='recipe-infos-left'>
            <div className='recipe-detail-card'>
              <div
                  className={`recipe-detail-background ${isDefaultImage ? 'default-background' : ''}`}
                  style={{ backgroundImage: `url(${bgImage})` }}
              />
            </div>
            <div className="recipe-detail-tags">
                {tags?.map((tag, index) => (
                    <span
                    key={index}
                    className="recipe-detail-tag"
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
          <div className='recipe-infos-right'>
            <div className="recipe-detail-data">
                <FontAwesomeIcon icon={faClock} className="icon icon-clock" />
                <span>{duration?.value} {duration?.unit}</span>
            </div>
            <div className="recipe-detail-data">
              <FontAwesomeIcon icon={faDollarSign} className="icon icon-price"/>
                {/* <span>{duration?.value} {duration?.unit}</span> */}
            </div>
            <div className="recipe-detail-data">
              <FontAwesomeIcon icon={faStar} className="icon icon-star" />
                {/* <span>{duration?.value} {duration?.unit}</span> */}
            </div>
          </div>
        </div>
    </div>
  );
}

RecipeDetailComponent.propTypes = {
  image: PropTypes.string,
  duration: PropTypes.shape({
    value: PropTypes.number,
    unit: PropTypes.string
  }).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  )
};


