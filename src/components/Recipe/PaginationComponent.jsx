import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/Recipes/PaginationComponent.css';

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  surroundingRange = 2,
  nearInterval = 5,
  nearWindow = 15,
}) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const getFarInterval = (totalPages) => {
    if (totalPages <= 100) return 25;
    if (totalPages <= 500) return 50;
    if (totalPages <= 1000) return 100;
    return Math.ceil(totalPages / 20);
  };

  const pagesToShow = new Set();

  // 1. Première & dernière page
  pagesToShow.add(1);
  pagesToShow.add(totalPages);

  // 2. Pages autour de la page actuelle
  for (
    let i = currentPage - surroundingRange;
    i <= currentPage + surroundingRange;
    i++
  ) {
    if (i > 1 && i < totalPages) {
      pagesToShow.add(i);
    }
  }

  // 3. Pages proches par intervalle
  for (
    let i = currentPage - nearWindow;
    i <= currentPage + nearWindow;
    i++
  ) {
    if (i > 1 && i < totalPages && i % nearInterval === 0) {
      pagesToShow.add(i);
    }
  }

  // 4. Pages lointaines avec intervalle élargi
  const farInterval = getFarInterval(totalPages);
  for (let i = 1; i <= totalPages; i++) {
    if (
      (i < currentPage - nearWindow || i > currentPage + nearWindow) &&
      i % farInterval === 0
    ) {
      pagesToShow.add(i);
    }
  }

  const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

  const rendered = [];
  let lastAddedPage = 0;
  let ellipsisCount = 0;

  for (const page of sortedPages) {
    if (lastAddedPage && page > lastAddedPage + 1) {
      rendered.push(
        <span key={`ellipsis-${ellipsisCount++}`} className="pagination-ellipsis">
          ...
        </span>
      );
    }

    rendered.push(
      <button
        key={`page-${page}`}
        className={`pagination-button ${page === currentPage ? 'active' : ''}`}
        onClick={() => handleClick(page)}
        aria-label={
          page === currentPage
            ? `Page ${page}, actuelle`
            : `Aller à la page ${page}`
        }
      >
        {page}
      </button>
    );

    lastAddedPage = page;
  }

  return <div className="pagination-container">{rendered}</div>;
};

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  surroundingRange: PropTypes.number,
  nearInterval: PropTypes.number,
  nearWindow: PropTypes.number,
};

export default PaginationComponent;
