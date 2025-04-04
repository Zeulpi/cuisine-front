import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeComponent from '../components/Recipe/RecipeComponent';
import PaginationComponent from '../components/Recipe/PaginationComponent';
import FilterComponent from '../components/Recipe/FilterComponent';
import { ROUTES } from '../resources/routes-constants';
import { getData } from '../resources/api-constants';
import '../styles/Recipes/RecipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState({});
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9); // Nombre de recettes par page
  const [filters, setFilters] = useState({}); // Pour les filtres de recherche, tags, etc.

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      console.log(filters.tags?.join(',')); // Debugging line
      
      try {
        const response = await axios.get(getData(ROUTES.RECIPE_ROUTE), {
          params: {
            page,
            limit,
            tags: filters.tags?.join(',') || '', // Passer les tags sélectionnés
            search: filters.search || '',
            // + plus tard : limit, search, tags...
          },
        });
  
        console.log('Response:', response.data); // Debugging line
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, [page, filters, limit]); // Re-fetch recipes when page or filters change
  

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <FilterComponent
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
      />

      {loading && (
        <div className="loading-indicator">
          <div className="spinner" />
          <span>Chargement...</span>
        </div>
      )}

      
      <div className="recipe-list">
        {Object.values(recipes)
        .sort((a, b) => a.name.localeCompare(b.name)) // ✅ tri alphabétique visuel
        .map((recipe, index) => (
          <RecipeComponent
            key={index} // ou autre identifiant
            name={recipe.name}
            image={recipe.image}
            duration={recipe.duration}
            tags={recipe.tags}
          />
        ))}
      </div>

      <PaginationComponent
        currentPage={pagination?.page}
        totalPages={pagination?.totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default RecipeList;
