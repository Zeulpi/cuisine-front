import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Utils/ProgressBar.css';

export const ProgressBar = ({ ownedQty=0, totalQty=0, ownedColor='lightgreen', totalColor='LightCoral', progressUnit='' }) => {
    const percent = totalQty === 0 ? 0 : (ownedQty / totalQty) * 100;
    const safePercent = Math.min(Math.max(percent, 0), 100); // Clamp entre 0 et 100

  return (
    <div className="progress-bar-container">
        <div className='progress-text'>
            <div className='progress-missing'>
                {(totalQty) && ((ownedQty||0)<totalQty) ? (<span>{totalQty-ownedQty} {progressUnit && (progressUnit)}</span>) : null}
            </div>
            <div className='progress-ratio'>
                <span>({ownedQty && (ownedQty) || 0} / {totalQty && (totalQty)} {progressUnit && (progressUnit)})</span>
            </div>
        </div>
        <div className="progress-bar">
        <div
            className="progress-bar__fill"
            style={{
            width: `${safePercent}%`,
            backgroundColor: ownedColor
            }}
        ></div>
        <div
            className="progress-bar__fill"
            style={{
            width: `${100 - safePercent}%`,
            backgroundColor: totalColor
            }}
        ></div>
        </div>
    </div>
  );
}
ProgressBar.propTypes = {
    ownedQty: PropTypes.number,
    totalQty: PropTypes.number,
    ownedColor: PropTypes.string,
    totalColor: PropTypes.string,
    progressUnit: PropTypes.string,
}