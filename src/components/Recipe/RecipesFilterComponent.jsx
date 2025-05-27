import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAppSelector } from '../../store/reducers/store';
import { getData } from '../../resources/api-constants';
import { ROUTES } from '../../resources/routes-constants';
import { getTextColor } from '../../utility/getTextColor';
import '../../styles/Recipes/FilterComponent.css';

export function RecipesFilterComponent({ filters, onFilterChange, loading }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedTags, setSelectedTags] = useState(filters?.tags || []);
  const [selectedIngredients, setSelectedIngredients] = useState(filters?.ingredients || {});
  const [availableTags, setAvailableTags] = useState([]);
  const userFridge = useAppSelector(state => state.fridge.inventory);

  useEffect(() => {
    setSearch(filters?.search || '');
    setSelectedTags(filters?.tags || []);
    setSelectedIngredients(filters?.ingredients || {});
  }, [filters]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(getData(ROUTES.TAG_ROUTE));
        setAvailableTags(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tags :", error.message);
      }
    };

    fetchTags();
  }, []);

  const hasActiveFilters = () => (filters.search?.trim() || filters.tags?.length > 0 || Object.keys(selectedIngredients).length > 0);

  // console.log('Selected Ingredients:', selectedIngredients);

  const toggleTag = (tagName) => {
    let newTags;
    if (selectedTags.includes(tagName)) {
      newTags = selectedTags.filter(t => t !== tagName);
    } else {
      if (selectedTags.length >= 3) return;
      newTags = [...selectedTags, tagName];
    }

    setSelectedTags(newTags);
    onFilterChange({ search, tags: newTags, ingredients: selectedIngredients });
  };
  const toggleIng = () => {
    Object.keys(selectedIngredients).length > 0 ?
      setSelectedIngredients({})
      : setSelectedIngredients(userFridge);
    // onFilterChange({ search, tags: selectedTags, ingredients: selectedIngredients });
    
  };

  useEffect(()=>{
    onFilterChange({ search, tags: selectedTags, ingredients: selectedIngredients });
    // console.log(selectedIngredients);
  }, [selectedIngredients])

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search, tags: selectedTags, ingredients: selectedIngredients });
  };

  return (
      <div className='filter-container'>
        <form className="filter-form" onSubmit={handleSubmit}>
          <div className='filters-list'>
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
            
            <div className="filter-ingredients">
              <button
                type="button"
                className={`ing-button ${Object.keys(selectedIngredients).length> 0 ? 'selected' : ''}`}
                onClick={() => toggleIng()}
                >
                Ingredients de votre inventaire
              </button>
            </div>
          </div>
          {hasActiveFilters() && (
          <div className="filter-actions">
            <button className="filter-reset" onClick={() => {setSearch(''); setSelectedTags([]); setSelectedIngredients({});}}>
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
    ingredients: PropTypes.objectOf(PropTypes.string),
  }),
  onFilterChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default RecipesFilterComponent;