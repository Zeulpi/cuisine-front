import React, { useState, useEffect, use } from 'react';
import PropTypes from 'prop-types';  // Validation des props
import { useAppDispatch, useAppSelector } from '../../store/reducers/store';
import { getIngredients } from '../../utility/FridgeUtils'
import LoadingComponent from '../Utils/loadingComponent';
import {PaginationComponent} from '../Utils/PaginationComponent';
import {CardComponent} from '../Utils/CardComponent';
import { baseUrl, RESOURCE_ROUTES } from '../../resources/routes-constants';
import { IngredientsFilterComponent } from './IngredientsFilterComponent';
import {findElementWithClass} from '../../utility/domUtils'
import '../../styles/User/IngredientModal.css'


export default function IngredientModal({ isOpen, onClose, cardWidth, chooseIngredient, modalTitle }) {
  const userToken = useAppSelector((state) => state.auth.token);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12); // Nombre d'ingredients par page
  const [filters, setFilters] = useState({search: ''});
  
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
      await chooseIngredient(id, ingQty.value, ingUnit.value);
    }
    setLoading(false);
  }
    

  return (
    <>
      <div className='ingredient-modal-title'>
        <h2 className='modal-title'>{(modalTitle && (modalTitle)) || (<span>&nbsp;</span>)}</h2>
        <LoadingComponent loading={loading} loadingText="Connecting ..." />
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
          {ingredients && Object.entries(ingredients)
          .sort(([, a], [, b]) => a.name.localeCompare(b.name)) // Tri sur la valeur
          .map(([id, ingredient]) => (
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
                  <select className='ingUnit' style={{width:'auto'}} onChange={handleUnit}>
                    {[...ingredient.units.includes("") || ingredient.units.includes(" ") ? [""] : [],
                      ...ingredient.units.filter(unit => unit !== "" && unit !== " ")]
                      .map((ingUnit, index)=>(
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
          ))}
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