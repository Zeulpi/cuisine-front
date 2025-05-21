import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/Recipes/FilterComponent.css';

export function IngredientsFilterComponent({ filters, onFilterChange, loading }) {
  const [search, setSearch] = useState(filters?.search || '');

  useEffect(() => {
    setSearch(filters?.search || '');
  }, [filters]);

  const hasActiveFilters = () => (filters.search?.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search });
  };

  return (
      <div className='filter-container'>
        <form className="filter-form" onSubmit={handleSubmit}>
          <div>
            <div className='filter-research'>
                <input
                    type="text"
                    placeholder="Rechercher un ingrédient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                />
                <button type="submit" className="filter-button" disabled={loading}>Rechercher</button>
            </div>
          </div>
          {hasActiveFilters() && (
          <div className="filter-actions">
            <button className="filter-reset" onClick={() => {setSearch('');}}>
              X
            </button>
          </div>
          )}
        </form>
      </div>
  );
}

IngredientsFilterComponent.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
  }),
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};