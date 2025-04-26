import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types';  // Validation des props
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/reducers/store';
import axios from 'axios';
import { extractIdAndSlug } from '../utility/slugify.js';
import { slugify } from '../utility/slugify.js';
import { ROUTES } from '../resources/routes-constants';
import { getData } from '../resources/api-constants';
import { setupSecureInput, presets } from '../utility/inputSanitizer.js';
import LoadingComponent from '../components/Utils/loadingComponent.jsx';
import RecipeDetailComponent from '../components/Recipe/RecipeDetailComponent.jsx';
import RecipeIngredientComponent from '../components/Recipe/RecipeIngredientComponent.jsx';
import StepBlocks from '../components/Recipe/StepBlocks.jsx';
import '../styles/Recipes/RecipeDetail.css';
import { BaseModal } from '../components/BaseModale.jsx';
import PlannerComponent from '../components/PlannerComponent.jsx';


const RecipeDetail = () => {
  const { sluggedId } = useParams();
  const { id, slug } = extractIdAndSlug(sluggedId);
  const [recipe, setRecipe] = useState(null);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [portions, setPortions] = useState(null);
  const [newPortions, setNewPortions] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { portionsFromCard } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchedId = useRef(null);
  const MAX_PORTIONS = 20;
  const MIN_PORTIONS = 1;
  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
  
  useEffect(() => { // Ajustement dynamique du bouton 'add to planner'
    const adjustAddButton = () => {
      const header = document.getElementById("app-header");
      const footer = document.getElementById("app-footer");
      const addButton = document.getElementById("detail-btn-add");

      if (header && footer && addButton) {
        addButton.style.top = `${header.offsetHeight + 20}px`;
        addButton.style.right = '20px';
      }
    };
  
    window.addEventListener("load", adjustAddButton);
    window.addEventListener("resize", adjustAddButton);
    adjustAddButton(); // initial call
  
    return () => {
      window.removeEventListener("load", adjustAddButton);
      window.removeEventListener("resize", adjustAddButton);
    };
  }, [isLoggedIn, recipe]);

  const togglePlannerModal = () => {
    setIsPlannerModalOpen(!isPlannerModalOpen);
  }

  const fetchRecipeDetail = async () => {
    const currentId = id; // snapshot de l’ID actuel
    if (lastFetchedId.current === id) return; // Skip si déjà fetché, evite de renvoyer une requete en cas de re-render
    lastFetchedId.current = id;

    setLoading(true);
    try {
      const response = await axios.get(getData(ROUTES.RECIPE_DETAIL(id)));
      // console.log('Response:', response.data); // Debugging line

      // Vérifie que l’ID est toujours le bon avant de set le state
      // Peut arriver si l'utilisateur navigue rapidement entre les recettes
      // ou si la recette a été supprimée entre-temps
      if (id !== currentId) {
        setLoading(false);
        return;
      }

      setRecipe(response.data);
      setPortions( response.data.portions);
    } catch (error) {
      console.error('Erreur lors du chargement de la recette :', error.response?.data.message); // Debugging line
      setError(error);
      navigate('/recipes'); // Redirection vers une 404 custom
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isNaN(id) || id <= 0 || id > 999999999) { // Vérification de la validité de l'ID
      if (window.history.length > 1) {  // Vérification de l'historique du navigateur
        // Si l'historique a plus d'une entrée, cela signifie que l'utilisateur est arrivé ici par un lien direct
        navigate(-1); // Retour à la page précédente
      } else {
        navigate('*'); // Redirection vers une 404 custom
      }
    }
    // console.log(`ID: ${id}, Slug: ${slug}`); // Debugging line

    // Appel à ton endpoint API pour récupérer la recette complète
    fetchRecipeDetail();
  }, [id]);

  useEffect(() => {
    if (recipe && slug !== slugify(recipe.name)) {
      navigate(`/recipes/${id}-${slugify(recipe.name)}`, { replace: true });
    }
  }, [recipe]);

  useEffect(() =>{
    isNaN(portionsFromCard) ? setNewPortions(portions) : setNewPortions(portionsFromCard) ;
  },[portions]);

  const handlePortions = (e) =>{
    const id = e.target.id;
    switch (id) {
      case 'portions-down':
        setNewPortions((prev) => Math.max(1, prev - 1));
        break;
      case 'portions-up':
        setNewPortions((prev) => prev + 1);
        break;
      case 'portion-count': {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value)) {
            setNewPortions(value);
          }
          break;
        }
      default:
        break;
    }
  }

  return (
    <>
    {recipe && (
      <>
      <title>
      {recipe?.name ? `${process.env.REACT_APP_APP_NAME} - ${recipe.name}` : process.env.REACT_APP_APP_NAME}
      </title>
      
      {isLoggedIn && (
        <div className='detail-btn-add' id='detail-btn-add' title='Ajouter la recette au planner'><button className="select-button" onClick={togglePlannerModal}>+</button></div>
      )}
      
      <div className='recipe-detail-page'>
        {loading && <LoadingComponent loading={loading} loadingText='Chargement de la recette ...'/>}
        {recipe && (
          <>
            <div className='recipe-title'>
              <h1>{recipe.name}</h1>
            </div>
          
            <RecipeDetailComponent image={recipe.image} duration={recipe.duration} tags={recipe.tags} />
            <div className='recipe-ingredients-container'>
              <div className='recipe-ingredients-header'>
                <h2 className='recipe-ingredients-title'>Ingrédients</h2>
                <div className='portion-container'>
                  <span className='portion-txt'>Pour &nbsp;</span>
                  <div className='portion-inputs'>
                    <input type='text'
                      id='portion-count' 
                      ref={(el) => setupSecureInput(el, presets.number)}
                      onChange={handlePortions} value={newPortions ?? ''}
                      onBlur={() => {
                        if (newPortions < MIN_PORTIONS) setNewPortions(MIN_PORTIONS);
                        if (newPortions > MAX_PORTIONS) setNewPortions(MAX_PORTIONS);
                      }}
                    >
                    </input>
                    <div className='portion-btns'>
                      <button id='portions-up' onClick={handlePortions} disabled={newPortions == MAX_PORTIONS}>+</button>
                      <button id='portions-down' onClick={handlePortions} disabled={newPortions == MIN_PORTIONS}>-</button>
                    </div>
                  </div>
                  <span className='portion-txt'>&nbsp; Personnes</span>
                </div>
              </div>
              <div className='recipe-ingredients-list'>
                {Object.entries(recipe.ingredients).map(([id, ingredient]) => (
                  id > 0 && (
                    <RecipeIngredientComponent key={id} name={ingredient.name} image={ingredient.image} quantity={ingredient.quantity} unit={ingredient.unit} ratio={Number((newPortions / portions).toFixed(2))} />
                  )
                ))}
              </div>
            </div>
            <div className='recipe-steps-container'>
              <div className='recipe-steps-header'>
                <h2 className='recipe-steps-title'>Etapes</h2>
              </div>
              <div className='recipe-steps-list'>
                <StepBlocks steps={recipe.steps} ingredients={recipe.ingredients} />
              </div>
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      <BaseModal isOpen={isPlannerModalOpen} cardWidth='60%'>
        <PlannerComponent plannerWidth='60%' plannerModalClose={togglePlannerModal} isPlannerModal={true} recipeFromDetail={recipe}/>
      </BaseModal>

      </>
    )}
    </>
  );
};

RecipeDetail.propTypes = {
  portionsFromCard: PropTypes.number,
};

export default RecipeDetail;