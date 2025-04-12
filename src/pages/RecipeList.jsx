import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import RecipeComponent from '../components/Recipe/RecipeComponent';
import PaginationComponent from '../components/Recipe/PaginationComponent';
import FilterComponent from '../components/Recipe/FilterComponent';
import LoadingComponent from '../components/Utils/loadingComponent';
import { clearPopStateHandler } from '../utility/popStateManager.js'
import { ROUTES } from '../resources/routes-constants';
import { getData } from '../resources/api-constants';
import '../styles/Recipes/RecipeList.css';
import { slugify } from '../utility/slugify.js';

const RecipeList = () => {
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

  // useEffect(() => {
  //   if (location.state?.scroll !== undefined) {
  //     setTimeout(() => window.scrollTo(0, location.state.scroll), 50);
  //   }
  // }, []);
  
  useEffect(() => {
    clearPopStateHandler();
    if (location.state?.fromRecipeList) {
      setFilters(location.state.filters || {});
      setPage(location.state.page || 1);
      setTimeout(() => {
        window.scrollTo(0, location.state.scroll || 0);
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (location.state?.fastSearch) {
      setFilters((prev) => ({ ...prev, search: location.state.fastSearch }));
      setPage(1);
    }
  }, [location.state?.nonce]);

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
    <>
      <title>
          {(`${process.env.REACT_APP_APP_NAME} - Liste des recettes`)}
      </title>

      <FilterComponent
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
            <Link to={`/recipes/${id}-${slugify(recipe.name)}`} key={id} className='recipe-link' state={{fromRecipeList: true, filters, page, scroll: window.scrollY}}>
              <RecipeComponent
                name={recipe.name}
                image={recipe.image}
                duration={recipe.duration}
                tags={recipe.tags}
              />
            </Link>
          ))}
      </div>

      { !loading && <PaginationComponent
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={handlePageChange}
      />
      }
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default RecipeList;
