import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import RecipeCardComponent from '../components/Recipe/RecipeCardComponent';
import PaginationComponent from '../components/Recipe/PaginationComponent';
import RecipesFilterComponent from '../components/Recipe/RecipesFilterComponent';
import LoadingComponent from '../components/Utils/loadingComponent';
import { clearPopStateHandler } from '../utility/popStateManager.js'
import { ROUTES } from '../resources/routes-constants';
import { getData } from '../resources/api-constants';
import '../styles/Recipes/RecipeList.css';
import '../styles/Recipes/FilterComponent.css'

const RecipeList = ({isModal = false, cardWidth='100%', chooseMeal=null }) => {
  const location = useLocation();
  const [recipes, setRecipes] = useState({});
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(location.state?.page || 1);
  const [limit, setLimit] = useState(9); // Nombre de recettes par page
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      // console.log(filters.tags?.join(',')); // Debugging line
      
      try {
        const response = await axios.get(getData(ROUTES.RECIPE_ROUTE), {
          params: {
            page,
            limit,
            tags: filters.tags?.join(',') || '', // Passer les tags sélectionnés
            search: filters.search || '',
          },
        });
  
        // console.log('Response:', response.data); // Debugging line
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
        // console.log('recipes:', response.data.recipes); // Debugging line
        
      } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, [page, filters, limit]);
  

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({top, behavior: "smooth"});
  };

  return (
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
      />

      <LoadingComponent loading={loading} />
      
      <div className="recipe-list">
        {Object.entries(recipes)
          .sort(([, a], [, b]) => a.name.localeCompare(b.name)) // Tri sur la valeur
          .map(([id, recipe]) => (
            // <Link to={`/recipes/${id}-${slugify(recipe.name)}`} key={id} className='recipe-link' state={{fromRecipeList: true, filters, page, scroll: window.scrollY}}>
                <RecipeCardComponent
                  key={id}
                  recipe={recipe}
                  isModal={isModal}
                  cardWidth={cardWidth}
                  chooseMeal={chooseMeal}
                />
            // </Link>
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
  );
};

RecipeList.propTypes = {
  isModal: PropTypes.bool.isRequired,
  cardWidth: PropTypes.string,
  chooseMeal: PropTypes.func,
};

export default RecipeList;
