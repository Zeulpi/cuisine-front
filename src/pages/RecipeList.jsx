import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import RecipeCardComponent from '../components/Recipe/RecipeCardComponent';
import {PaginationComponent} from '../components/Utils/PaginationComponent';
import RecipesFilterComponent from '../components/Recipe/RecipesFilterComponent';
import LoadingComponent from '../components/Utils/loadingComponent';
import { ROUTES } from '../resources/routes-constants';
import { getData } from '../resources/api-constants';
import '../styles/Recipes/RecipeList.css';
import '../styles/Recipes/FilterComponent.css'
import { BaseModal } from '../components/Utils/BaseModale';
import { slugify } from '../utility/slugify';
import { RecipeDetail } from './RecipeDetail';

export function RecipeList({isModal = false, cardWidth='100%', chooseMeal=null }) {
  const location = useLocation();
  const [recipes, setRecipes] = useState({});
  const initialState = {id: null, name: null}
  const [choosenRecipe, setChoosenRecipe] = useState(initialState);
  const [recipeSlug, setRecipeSlug] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(location.state?.page || 1);
  const [limit, setLimit] = useState(9); // Nombre de recettes par page
  const [error, setError] = useState(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [filters, setFilters] = useState(location.state?.filters || {
    search: location.state?.fastSearch || '',
    tags: [],
  });

  useEffect(() => {
    if (location.state?.fastSearch) {
      setFilters((prev) => ({ ...prev, search: location.state.fastSearch }));
      setPage(1);
    }
  }, [location.state?.nonce, location.state?.fastSearch]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getData(ROUTES.RECIPE_ROUTE), {
        params: {
          page,
          limit,
          tags: filters.tags?.join(',') || '', // Passer les tags sélectionnés
          search: filters.search || '',
        },
      });
      setRecipes(response.data.recipes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes :', error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [page, filters, limit]);
  
  useEffect(()=>{
    // console.log(choosenRecipe);
    // choosenRecipe.id ? toggleRecipeModal() : null;
    // toggleRecipeModal();
    if (choosenRecipe.id) {
      setRecipeSlug(`${choosenRecipe.id}-${slugify(choosenRecipe.name)}`);
      // setIsRecipeModalOpen(true);
    }
  }, [choosenRecipe]);

  useEffect(()=>{
    // console.log('slug : ',recipeSlug);
    if (recipeSlug) {
      // console.log('recipeSlug', recipeSlug);
      toggleRecipeModal();
    }
  }, [recipeSlug]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({top, behavior: "smooth"});
  };

  const chooseRecipe = (recipe) => {
    setChoosenRecipe(recipe);
  }

  async function toggleRecipeModal() {
    isRecipeModalOpen ? (setIsRecipeModalOpen(!isRecipeModalOpen), setRecipeSlug(null), setChoosenRecipe(initialState)) : setIsRecipeModalOpen(!isRecipeModalOpen);
    choosenRecipe.id ? setIsRecipeModalOpen(!isRecipeModalOpen) : null;
    // console.log('toggleRecipeModal', recipeSlug);
  }

  return (
    <>
    {!error && (
      <>
    <div id='recipe-list'>
      {!isModal && (
        <title>
          {(`${process.env.REACT_APP_APP_NAME} - Liste des recettes`)}
        </title>
      )}
      

      <RecipesFilterComponent
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        loading={loading}
      />

      <LoadingComponent loading={loading} />
      
      <div className="recipe-list">
        {Object.entries(recipes)
          .sort(([, a], [, b]) => a.name.localeCompare(b.name)) // Tri sur la valeur
          .map(([id, recipe]) => (
            <RecipeCardComponent
              key={id}
              recipe={recipe}
              isModal={isModal}
              cardWidth={cardWidth}
              chooseMeal={chooseMeal}
              chooseRecipe={chooseRecipe}
            />
          ))}
      </div>

      { !loading && <PaginationComponent
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={handlePageChange}
      />
      }
      {error && <div className="error-message">{error}</div>}
    </div>
    <BaseModal isOpen={isRecipeModalOpen} cardWidth='100%'  bodyWidth={'100%'}>
      <RecipeDetail recipeSlug={recipeSlug} onClose={toggleRecipeModal}/>
    </BaseModal>
    </>
    )}
    </>
  );
}

RecipeList.propTypes = {
  isModal: PropTypes.bool.isRequired,
  cardWidth: PropTypes.string,
  chooseMeal: PropTypes.func,
}