import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Recipes/FilterComponent.css';
import { getData } from '../../resources/api-constants';
import { ROUTES } from '../../resources/routes-constants';

const FilterComponent = ({ filters, onFilterChange }) => {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedTags, setSelectedTags] = useState(filters?.tags || []);
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSearch(filters?.search || '');
    setSelectedTags(filters?.tags || []);
  }, [filters]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(getData(ROUTES.TAG_ROUTE));
        setAvailableTags(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tags :", error);
      }
    };

    fetchTags();
  }, []);

  const hasActiveFilters = () => (filters.search?.trim() || filters.tags?.length > 0);

  const toggleTag = (tagName) => {
    let newTags;
    if (selectedTags.includes(tagName)) {
      newTags = selectedTags.filter(t => t !== tagName);
    } else {
      if (selectedTags.length >= 3) return;
      newTags = [...selectedTags, tagName];
    }

    setSelectedTags(newTags);
    onFilterChange({ search, tags: newTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search, tags: selectedTags });
  };

  const handleReset = () => {
    setSearch('');
    setSelectedTags([]);
    onFilterChange({ search: '', tags: [] });

    navigate('/recipes');
  }

  return (
      <div className='filter-container'>
        <form className="filter-form" onSubmit={handleSubmit}>
            <div className='filter-research'>
                <input
                    type="text"
                    placeholder="Rechercher une recette..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                />
                <button type="submit" className="filter-button">Rechercher</button>
            </div>

            <div className="filter-tags">
                <div className="tag-list">
                    {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    const isDisabled = !isSelected && selectedTags.length >= 3;

                    return (
                        <button
                        key={tag.name}
                        type="button"
                        className={`tag-button ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => toggleTag(tag.name)}
                        disabled={isDisabled}
                        style={{ '--tag-color': tag.color, '--text-color': getTextColor(tag.color) }}
                        >
                        {tag.name}
                        </button>
                    );
                    })}
                </div>
            </div>
        </form>
        {hasActiveFilters() && (
          <div className="filter-actions">
            <button type="reset" className="filter-reset" onClick={handleReset}>
              X
            </button>
          </div>
        )}


      </div>
  );
};

FilterComponent.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterComponent;

function getTextColor(bgColor) {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 160 ? '#000' : '#fff';
}
