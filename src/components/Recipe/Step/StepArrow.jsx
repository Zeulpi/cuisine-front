import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/Recipes/StepArrow.css'

export default function StepArrow({ direction = 'right-down', color = 'black' }) {
  switch (direction) {
    case 'right-down':
      return (
        <div className="arrow-right-down">
            <div className='arrow-rd'>
                <div className="arrow-line-horizontal" />
                <svg className="arrow-turn" viewBox="0 0 50 50" width="50" height="50">
                    <path d="M0 0 Q50 0 50 50" stroke="black" fill="transparent" strokeWidth="2"/>
                    <path d="M45 45 L50 50 L55 45" stroke="black" fill="transparent" strokeWidth="2"/>
                </svg>
            </div>
            <div className='arrow-text-rd'><p>Simultanément</p></div>
        </div>
      );

    case 'left-down':
      return (
        <div className="arrow-left-down">
            <div className='arrow-text-ld'><p></p></div>
            <div className='arrow-rd'>
                <svg className="arrow-turn" viewBox="0 0 50 50" width="50" height="50">
                    <path d="M50 0 Q0 0 0 50" stroke="black" fill="transparent" strokeWidth="2"/>
                    <path d="M-5 45 L0 50 L5 45" stroke="black" fill="transparent" strokeWidth="2"/>
                </svg>
                <div className="arrow-line-horizontal" />
            </div>
        </div>
      );

    case 'down':
      return (
        <div className="arrow-container arrow-d-container">
          <svg width="40" height="50" viewBox="0 0 40 60" preserveAspectRatio="none">
            <path d="M20 0 V50" stroke={color} fill="transparent" strokeWidth="2"/>
            <path d="M15 45 L20 50 L25 45" stroke={color} fill="transparent" strokeWidth="2"/>
          </svg>
        </div>
      );

    case 'down-down':
      return (
        <div className="arrow-d-d-container">
          <svg width="40" height="50" viewBox="0 0 40 60" preserveAspectRatio="none">
            <path d="M20 0 V50" stroke={color} fill="transparent" strokeWidth="2"/>
            <path d="M15 45 L20 50 L25 45" stroke={color} fill="transparent" strokeWidth="2"/>
          </svg>
        </div>
      );

    default:
      return null;
  }
}

StepArrow.propTypes = {
  direction: PropTypes.oneOf(['right-down', 'left-down', 'down']),
  color: PropTypes.string,
};
