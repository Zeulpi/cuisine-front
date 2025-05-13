import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Recipes/FilterComponent.css';
import { getData } from '../../resources/api-constants';
import { ROUTES } from '../../resources/routes-constants';
import { getTextColor } from '../../utility/getTextColor';

export function RecipesFilterComponent({ filters, onFilterChange, loading }) {
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

  return (
      <div className='filter-container'>
        <form className="filter-form" onSubmit={handleSubmit}>
          <div>
            <div className='filter-research'>
                <input
                    type="text"
                    placeholder="Rechercher une recette..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                />
                <button type="submit" className="filter-button" disabled={loading}>Rechercher</button>
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
          </div>
          {hasActiveFilters() && (
          <div className="filter-actions">
            <button className="filter-reset" onClick={() => {setSearch(''); setSelectedTags([]);}}>
              X
            </button>
          </div>
          )}
        </form>
        


      </div>
  );
}

RecipesFilterComponent.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default RecipesFilterComponent;