import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Utils/loadingComponent.css';

export default function LoadingComponent({ loading, loadingText='Chargement...' }) {
  return (
    <div className="loading-component">
      {loading && (
        <div className="loading-indicator">
          <FontAwesomeIcon icon={faCircleNotch} spin size="1x" />
          <span>{loadingText}</span>
        </div>
      )}
    </div>
  );
}

LoadingComponent.propTypes = {
  loading: PropTypes.bool.isRequired,
    loadingText: PropTypes.string,
};