import React, { useState, useEffect, use } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import { getIngredients } from '../../utility/FridgeUtils'
import LoadingComponent from '../Utils/loadingComponent';
import {PaginationComponent} from '../Utils/PaginationComponent';
import {CardComponent} from '../Utils/CardComponent';
import { baseUrl, RESOURCE_ROUTES } from '../../resources/routes-constants';
import { IngredientsFilterComponent } from './IngredientsFilterComponent';
import {findElementWithClass, normalizeAllowedUnits} from '../../utility/domUtils'
import '../../styles/User/IngredientModal.css'


export default function IngredientModal({ isOpen, onClose, cardWidth, chooseIngredient, modalTitle }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12); // Nombre d'ingredients par page
  const [filters, setFilters] = useState({search: ''});
  const [addMessage, setAddMessage] = useState(null);
  
  async function fetchIngredients() {
    setLoading(true);
    try {
      const response = await getIngredients(page, limit, filters);
      // console.log(response);
      setIngredients(response.ingredients);
      setPagination(response.pagination);
    } catch (error) {
      setErrorMessage("Erreur lors de la récupération des ingrédients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {  
    fetchIngredients();
  }, [page, limit, filters]);

  useEffect(()=>{
    // console.log(ingredients);
  }, [ingredients, pagination])

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({top, behavior: "smooth"});
  };

  const handleQty = (event) => {
    // console.log(event.target.value);
  }
  const handleUnit = (event) => {
    // console.log(event.target.value);
  }

  async function handleIngredient (element, id) {
    setLoading(true);
    const ingredient = element.target;
    const ingName = findElementWithClass(ingredient, '.basic-card', '.card-header');
    const ingQty = findElementWithClass(ingredient, '.basic-card', '.ingQty');
    const ingUnit = findElementWithClass(ingredient, '.basic-card', '.ingUnit');

    if (ingName.textContent && ingQty.value) {
      try{
        await chooseIngredient(id, ingQty.value, ingUnit.value);
        handleAddMessage();
      } catch (error) {
        // console.log(error);
      }
    }
    setLoading(false);
  }

  const handleAddMessage = () => {
    const messageDiv = document.querySelector(".ingredient-add-message");
    setAddMessage("Ingrédient ajouté à l'inventaire");
    // Affiche le message immédiatement
    messageDiv.style.display = "flex";
    messageDiv.classList.remove("fade-out");
    // Après 5s → démarre la transition (fade out)
    setTimeout(() => {
      messageDiv.classList.add("fade-out");
    }, 5000);
    // Après 5s + 2s (temps de la transition) → cache complètement
    setTimeout(() => {
      messageDiv.style.display = "none";
      messageDiv.classList.remove("fade-out"); // prêt pour le prochain affichage
    }, 7000);
  };
    

  return (
    <>
      <div className='ingredient-modal-title-container'>
        <div className='ingredient-modal-title'>
          <h2 className='modal-title'>{(modalTitle && (modalTitle)) || (<span>&nbsp;</span>)}</h2>
        </div>
        <LoadingComponent loading={loading} loadingText="Connecting ..." />
        <div className='ingredient-add-message'>{addMessage && (<span className='ingredient-message'>{addMessage}</span>)}</div>
        <button className="ingredient-close-btn" onClick={onClose} tabIndex={5}>X</button>
      </div>

      <div className="ingredient-modal-content" onClick={(e) => e.stopPropagation()} id='recipe-modal' style={{ '--card-width': cardWidth }}>

        <IngredientsFilterComponent
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
          }}
          loading={loading}
        />

        <div className='ingredient-list'>
          {
          ingredients && Object.entries(ingredients)
          .sort(([, a], [, b]) => a.name.localeCompare(b.name)) // Tri sur la valeur
          .map(([id, ingredient]) => {
            const ingredientUnits = normalizeAllowedUnits(ingredient.units);
            return (
            <CardComponent
              key={id}
              cardWidth={cardWidth}
              cardName={ingredient.name}
              cardImg={baseUrl + RESOURCE_ROUTES.INGREDIENT_IMAGE_ROUTE + ingredient.image}
              cardCursor='pointer'
              childrenTarget='body-footer'
              childrenFooter={
                <>
                <div className='ingredient-qtys'>
                  <input className='ingQty' type='number' style={{maxWidth:'30%', height:'25px', padding:0, borderWidth:1}} min={0} onChange={handleQty} />
                  <select className='ingUnit' style={{width:'auto'}} onChange={handleUnit} defaultValue={(ingredientUnits.includes("") ? "":null, ingredientUnits.includes(" ") ? " " : null)}>
                    {ingredientUnits.map((ingUnit, index)=>(
                      <option key={index} value={ingUnit}>{ingUnit}</option>
                    ))}
                  </select>
                </div>
                </>
              }
            >
              <>
                <div className='click-div' style={{display:'flex', position:'relative', height:'100%', zIndex:'10'}} onClick={(event)=>{handleIngredient(event, ingredient.id)}}>
                </div>
              </>
            </CardComponent>
          )
          })}
        </div>

        { !loading && <PaginationComponent
          currentPage={pagination?.page}
          totalPages={pagination?.totalPages}
          onPageChange={handlePageChange}
        />
        }
      </div>
    </>
  );
}

IngredientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cardWidth: PropTypes.string,
  chooseIngredient: PropTypes.func,
  modalTitle: PropTypes.string,
};