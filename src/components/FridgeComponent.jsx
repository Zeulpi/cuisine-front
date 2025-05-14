import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BaseModal } from "./Utils/BaseModale";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { useSelector } from "react-redux";
import {CardComponent} from "./Utils/CardComponent";
import IngredientModal from "./User/IngredientModal";
import LoadingComponent from "./Utils/loadingComponent";
import { addIngredientToInventory, getFridgeFromServer } from "../utility/FridgeUtils";
import { normalizeAllowedUnits } from "../utility/domUtils";
import { baseUrl, RESOURCE_ROUTES } from '../resources/routes-constants';
import '../styles/User/FridgeComponent.css'

export function FridgeComponent() {
  const cardWidth = "150px";
  const ingCardWidth = "200px";
  const useDispatch = useAppDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [updated, setUpdated] = useState(false);
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.auth.token);
  const userFridge = useSelector(state => state.fridge.inventory);

  async function retrieveFridge() {
    if (!isLoggedIn) {
      navigate("/"); // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
    } else {
      setLoading(true);
      const response = await getFridgeFromServer(userToken, useDispatch); // si connecté, on va chercher l'inventaire sur le serveur
      setLoading(false);
      return response;
    }
  }

  useEffect(() => { // Vérification de la connexion de l'utilisateur
    // lors du changement d'état isLoggedIn, fetch l'inventaire
      setData(retrieveFridge());
  }, [isLoggedIn, navigate]);


  useEffect(() => {
    // console.log(userFridge);
  }, [userFridge]);

  const changeInputValue = (id, newValue, ingredientUnit) => {
    // Sélectionner tous les formulaires avec ce data-id
    const forms = document.querySelectorAll(`form[data-id="${id}"]`);
    forms.forEach(form => {
      // Trouver le select à l'intérieur du formulaire qui contient le data-unit correspondant
      const select = form.querySelector('select[name="unit"]');
      if (select && select.dataset.unit === ingredientUnit) {  // Vérifier si l'attribut data-unit correspond à l'unité de l'ingrédient
        // Trouver l'input quantity à l'intérieur du formulaire
        const input = form.querySelector('input[name="quantity"]');
        if (input) {
          // Extraire la valeur actuelle de l'input et la convertir en nombre
          const currentValue = parseFloat(input.value) || 0; // Si la valeur est vide, on la met à 0
          // Ajouter la nouvelle valeur à la quantité existante
          const updatedValue = currentValue + parseFloat(newValue);
          // Mettre à jour la valeur de l'input
          input.value = updatedValue;
        }
      }
    });
  };


  async function handleAddIngredient (ingredientId, ingredientQty, ingredientUnit, changeInputs=true) {
    setLoading(true);
    let callChangeValue = false;
    const forms = document.querySelectorAll(`form[data-id="${ingredientId}"]`);
    forms.forEach(form => {
      // Trouver le select à l'intérieur du formulaire qui contient le data-unit correspondant
      const select = form.querySelector('select[name="unit"]');
      if (select && select.dataset.unit === ingredientUnit) {
        callChangeValue = true;
      }
    });
    if(ingredientId && ingredientQty){
      // console.log('ajout : ', ingredientId, ingredientQty, ingredientUnit);
      const message = await addIngredientToInventory(useDispatch, userToken, ingredientId, ingredientQty, ingredientUnit);
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : parametre manquant');
    }
    changeInputs && callChangeValue && changeInputValue(ingredientId, ingredientQty, ingredientUnit);
    setLoading(false);
  }


  const handleAddButton = () => {
    toggleIngredientModal();
  }

  const toggleIngredientModal = () => {
    setIsIngredientModalOpen(!isIngredientModalOpen);
  }

  async function handleSubmit (e) {
    e.preventDefault();
    // Récupérer les valeurs des champs du formulaire
    const ingredientId = parseInt(e.target.dataset.id);
    const ingredientIndex = e.target.dataset.index;
    const formData = new FormData(e.target);
    const quantity = parseFloat(formData.get('quantity'));
    const unit = formData.get('unit');
    let newUnit;
    let newQty;
    const entry = userFridge[ingredientId][ingredientIndex];

    // Verif des 4 cas possibles
    // 1 - l'unit ne change pas et la quantité ne change pas => rien a mettre a jour on ne fait rien
    // 2 - l'unit ne change pas et la quantité est modifiée => on calcule la différence avec l'ancienne qty et on envoie au back
    // 3&4 - l'unit change et/non-et la qty => on supprime l'ancienne entrée pour cette unit, et on ajoute la qty a l'entrée avec la nouvelle unit
    if(entry.unit == unit) { // cas 1 & 2
      newUnit = entry.unit;
      newQty = quantity;
      if(entry.quantity == quantity){ // 1 - unit et qty ne changent pas, on ne fait rien
        // console.log('cas 1');
        return true;
      } else { // 2 - unit ne change pas, seule la qty
        // console.log('cas 2');
        newQty = quantity - entry.quantity; // Calcul de la nouvelle qty (la différence avec l'ancienne qty)
        await handleAddIngredient (ingredientId, newQty, newUnit, false); // Requete mise a jour au back
      }
    } else { // cas 3 & 4
      newUnit = unit;
      newQty = quantity; // Calcul de la nouvelle qty (la différence avec l'ancienne qty)
      // console.log('cas 3&4');
      try{
        await handleAddIngredient (ingredientId, -entry.quantity, entry.unit, false); // Requete suppression de l'ancienne entrée unit
        // console.log(ingredientId, newQty, newUnit);
        await handleAddIngredient (ingredientId, quantity, newUnit); // Requete ajout qty a l'entrée unit
      } catch (error) {
        console.log('Erreur lors de la mise à jour de l\'ingrédient :', error);
      }
    }
  }

  async function handleIngredientRemove(e){
    // console.log(e.target);
    const card = (e.target).closest(".basic-card"); // selectionner la bonne card
    const cardForm = card.querySelector(".ingredient-qtys"); // selectionner le form qui contient les inputs
    const ingredientId = parseInt(cardForm.dataset.id); // recuperer l'id d'ingredient
    const cardQty = parseFloat(cardForm.querySelector(".ingQty").value); // recuperer la qté d'ingredient
    const cardUnit = cardForm.querySelector(".ingUnit").value; // recuperer l'unité d'ingredient

    if (ingredientId && cardQty){
      await handleAddIngredient (ingredientId, (-cardQty), cardUnit); // enlever la quantité a l'entrée d'ingrédient de cette unité dans l'inventaire User
    }
  }

  return (
    <div className="fridge">

    <LoadingComponent loading={loading} />

    <div className="ingredient-main-container">
      <div className="ingredient-add-container">
        <CardComponent
          cardWidth={cardWidth}
          childrenTarget='body'
          cardName='Ajouter un ingredient'
          cardCursor="default"
        >
          <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
            <button
              className="select-button"
              style={{margin:'auto'}}
              onClick={handleAddButton}
              disabled={loading}
            > + </button>
          </div>
        </CardComponent>
      </div>

      <div className="ingredient-list-container">
        {
          Object.keys(userFridge).map((id) => {
            const ingredientList = userFridge[id];
            // console.log(ingredientList);

            return ingredientList.map((ingredient, index) => {
              const allowedUnits = normalizeAllowedUnits(ingredient.allowedUnits);
              return(
                <CardComponent
                  key={`${id}-${index}`}
                  cardWidth={ingCardWidth}
                  cardName={ingredient.name}
                  cardImg={baseUrl + RESOURCE_ROUTES.INGREDIENT_IMAGE_ROUTE + (ingredient.image)}
                  cardCursor="default"
                  isModal={true}
                  handleRemove={handleIngredientRemove}
                  childrenFooter={!loading &&
                    <>
                    <form data-id={id} data-index={index} className='ingredient-qtys' onSubmit={handleSubmit}>
                      <input name="quantity" className='ingQty' type='number' style={{maxWidth:'30%', height:'25px', padding:0, borderWidth:1}} min={0} defaultValue={ingredient.quantity} />
                      <select name="unit" data-unit={ingredient.unit} className='ingUnit' style={{width:'auto'}} defaultValue={ingredient.unit}>
                        {[
                          // Ajouter l'option vide en premier si elle existe dans la liste
                          ...(allowedUnits.includes("") || allowedUnits.includes(" ") 
                            ? [""] : []),  // Si la liste contient une valeur vide, l'ajouter en premier
                            ...allowedUnits.filter(unit => unit !== "" && unit !== " ") // Le reste des unités
                            ].map((ingUnit, index) => (
                            <option key={index} value={ingUnit}>{ingUnit}</option>
                        ))}
                      </select>
                      <button style={{borderRadius:'50%', borderWidth:'1px'}}>OK</button>
                    </form>
                    </>
                  }
                />
              )
            });
          })
        }
      </div>
    </div>

    <BaseModal isOpen={isIngredientModalOpen} cardWidth='60%' >
      <IngredientModal
        onClose={toggleIngredientModal}
        cardWidth={ingCardWidth}
        chooseIngredient={handleAddIngredient}
        modalTitle='Ajoutez un ingrédient a votre inventaire'
      />
    </BaseModal>
    </div>
  );
}

FridgeComponent.propTypes = {
};