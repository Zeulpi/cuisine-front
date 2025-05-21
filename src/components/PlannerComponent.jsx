import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import {RecipeModal} from "./User/RecipeModal";
import { RecipeDetail } from "../pages/RecipeDetail";
import { BaseModal } from "./Utils/BaseModale";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import RecipeCardComponent from "./Recipe/RecipeCardComponent";
import LoadingComponent from "./Utils/loadingComponent";
import { destockIngredients } from "../utility/plannerUtils";
import { getShoppingIngredients } from "../utility/shoppingUtils";
import { slugify } from "../utility/slugify";
import ShoppingModal from "./User/ShoppingModal";
import { sendPlannerToServer, getPlannersFromServer, removeRecipeFromPlanner, adjustTableSize } from "../utility/plannerUtils";
import {getServerTime, compareDates, daysOfWeek} from "../utility/dateUtils";
import {CardComponent} from "./Utils/CardComponent";
import '../styles/User/PlannerComponent.css'

export function PlannerComponent({ plannerWidth = '40vw', plannerModalClose=null, isPlannerModal=false, recipeFromDetail=null }) {
  const cardWidth = "150px";
  const useDispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false); // true si planner expiré et qu'un nouveau planner a été crée en active
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
  const [isShoppingAllModalOpen, setIsShoppingAllModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const [dayChoice, setDayChoice] = useState(null);
  const [dayKey, setDayKey] = useState(null);
  const userToken = useAppSelector((state) => state.auth.token);
  const [plannerId, setPlannerId] = useState(1); // 0 = planner a venir, 1 = planner actif, 2 = planner -1 semaine, 3 = planner -2 semaines
  const planners = useAppSelector(state => state.auth.userPlanner);
  let userPlanner = planners[plannerId].recipes ; // Récupérer le planner actif de l'utilisateur
  const userRecipes = useAppSelector(state => state.recipe.recipes);
  const [ingredients, setIngredients] = useState(null);
  const [allIngredients, setAllIngredients] = useState(null);
  const serverDate = getServerTime();
  const initialState = {id: null, name: null}
  const [choosenRecipe, setChoosenRecipe] = useState(initialState);
  const [recipeSlug, setRecipeSlug] = useState(null);
  const [weekTitle, setWeekTitle] = useState(["Semaine prochaine", "Semaine actuelle", "Il y a 1 semaine", "Il y a 2 semaines", "Cette semaine et la suivante"]);

  async function retrievePlanner() {
    if (!isLoggedIn) {
      navigate("/"); // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
    } else {
      let response;
      setLoading(true);
      try {
        response = await getPlannersFromServer(userToken, useDispatch); // si connecté, on va chercher les planners sur le serveur
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
      return response;
    }
  }

  async function fetchShoppingIngredients(list=null, plannerIndex=-1) {
    setLoading(true);
    // console.log('fetchShoppingIngredients : ', list);
    try {
      const result = await getShoppingIngredients(list, userToken, plannerIndex); // Récupérer la liste des ingrédients
      plannerIndex>=0 ? setIngredients(result.ingredients) : setAllIngredients(result.ingredients); // Mettre à jour la liste des ingrédients dans le state
      // console.log('ingredients : ', result.ingredients);
    } catch (error) {
      // setErrorMessage("Erreur lors de la récupération des ingrédients.");
      setError(error);
    } finally {
      setLoading(false);
    }
  }

   // Au chargement du composant, on va chercher les données du planner
  useEffect(()=>{
    setData(retrievePlanner());
    data == 'updated' ? setUpdated(true) : null;
  }, []);

  useEffect(() => { // Vérification de la connexion de l'utilisateur
    // lors du changement d'état isLoggedIn, fetch le planner
      setData(retrievePlanner());
      data == 'updated' ? setUpdated(true) : null;
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    window.addEventListener("load", adjustTableSize);
    window.addEventListener("resize", adjustTableSize);
    adjustTableSize(); // initial call

    // Nettoyage des écouteurs d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("load", adjustTableSize);
      window.removeEventListener("resize", adjustTableSize);
    };
  }, []);

  useEffect(() => { // Ouverture de la modale si un jour est choisi (click bouton +)
    dayChoice !== null ? setIsRecipeModalOpen(true) : setIsRecipeModalOpen(false);
  }, [dayChoice]);
  
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
      toggleDetailModal();
    }
  }, [recipeSlug]);

  const chooseRecipe = (recipe) => {
    setChoosenRecipe(recipe);
  }

  async function toggleDetailModal() {
    isDetailModalOpen ? (setIsDetailModalOpen(!isDetailModalOpen), setRecipeSlug(null), setChoosenRecipe(initialState)) : setIsDetailModalOpen(!isDetailModalOpen);
    choosenRecipe.id ? setIsDetailModalOpen(!isDetailModalOpen) : null;
    // console.log('toggleDetailModal', recipeSlug);
  }

  const toggleRecipeModal = () => {
    setIsRecipeModalOpen(!isRecipeModalOpen);
  }

  async function toggleShoppingModal() {
    !isShoppingModalOpen ?
      await fetchShoppingIngredients(userPlanner, plannerId)
      : null;
    setIsShoppingModalOpen(!isShoppingModalOpen);
  }
  async function toggleShoppingAllModal() {
    !isShoppingAllModalOpen ?
      await fetchShoppingIngredients(planners)
      : null;
    setIsShoppingAllModalOpen(!isShoppingAllModalOpen);
  }

  // Fonction pour vérifier la date lors de l'appui bouton '+'
  // Nécessaire Quand l'heure passe minuit => vérifier et mettre a jour l'état visuel du planner (désactiver le jour qui vient de se terminer)
  const handleAddButton = (btnDay, dayObjKey, dayObjDay) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Vérifier la validité de la date client par rapport a la date server
    (currentDate < serverDate) ? setData(retrievePlanner()) : null;

    const isButtonValid = compareDates(currentDate, planners[plannerId].weekStart, btnDay);

    if (!isButtonValid) {
      setData(retrievePlanner());
      return false;
    }
    else { // Comportement différent si on est sur la page planner ou sur la modale Planner depuis la page RecipeDetail
      isPlannerModal ?
      handleAddRecipe(dayObjKey, recipeFromDetail, recipeFromDetail.portions)
      : chooseDay(`${dayObjDay} midi`, dayObjKey);
    }
  }

  async function handleAddRecipe (keyWord, recipe, portions) { // ajouter un couple jour/recette au planner actif dans le store
    setLoading(true);
    if(keyWord && recipe){
      // console.log('planner id : ', plannerId);
      const message = await sendPlannerToServer(keyWord, recipe, portions, useDispatch, userToken, plannerId); // Envoi de la recette au serveur
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : clé du jour ou recette manquante.');
    }
    setLoading(false);
  }

  async function handleRemoveRecipe (keyWord) {
    setLoading(true);
    if(keyWord){
      const message = await removeRecipeFromPlanner(keyWord, useDispatch, userToken, plannerId); // Envoi de la recette au serveur
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : clé du jour ou recette manquante.');
    }
    setLoading(false);
  }

  const handlePlannerChange = (event) => {
    switch (event.target.id) {
      case 'planner-next-arrow':
        // console.log('next');
        plannerId > 0 ? setPlannerId((plannerId-1)) : null;
        break;
      case 'planner-prev-arrow':
        // console.log('prev');
        plannerId < 3 ? setPlannerId((plannerId+1)) : null;
        break;
    
      default:
        break;
    }
  }

  const chooseDay = (name=null, key=null) => {
    // console.log(name, key);
    
    if (name && key) {
      setDayChoice(name);
      setDayKey(key);
      // console.log(`Recette choisie pour ${name} :`, key);
    }
    else {
      setDayChoice(null);
      setDayKey(null);
      toggleRecipeModal(); // Fermer la modale recette si aucun jour n'est sélectionné
    }
  }

  const chooseMeal = (recipe, key=null, portions=1) => {
    if (dayKey && recipe && key === null) {
      handleAddRecipe(dayKey, recipe, portions);
      // console.log(`Recette ajoutée pour ${dayKey} :`, recipe);
    } else if (recipe && key) { // Si une recette est déjà présente, on la remplace
      handleRemoveRecipe(key); // Supprimer l'ancienne recette
      // console.log(`Recette supprimée pour ${key} :`, recipe);
    }
    setDayKey(null); // Réinitialiser la clé du jour après l'ajout
    setDayChoice(null); // Réinitialiser le choix du jour après l'ajout
  }

  async function handleDestock(mealKey, destock=false) {
    setLoading(true);
    const destockRecipes = {};
    destockRecipes[mealKey] = (planners[plannerId].recipes)[mealKey] ;
    const ings = await destockIngredients (destockRecipes, mealKey, plannerId, userToken, useDispatch, destock);
    setLoading(false);
  }

  return (
    <>
    {!error && isLoggedIn &&(
    <>
    <div className="planner" style={{ '--table-width': plannerWidth }}>
      {isPlannerModal && recipeFromDetail && (
        <div className='planner-modal-title'>
          <div className="spacer-div"></div>
          <h3 className="planner-modal-recipe-name">Choisissez un créneau pour {`"${recipeFromDetail.name}"`}</h3>
          <button className="planner-close-btn" onClick={plannerModalClose} tabIndex={5}>X</button>
        </div>
      )}
      {updated == true && (
        <div className="planner-update">Nouvelle semaine : Planner mis a jour &nbsp; <button onClick={()=>{setUpdated(false)}}>X</button></div>
      )}
      <LoadingComponent loading={loading} />
      <div className="planner-frame">
        <div className="planner-prev">
          {((plannerId < 3 && isPlannerModal == false) || (plannerId < 1 && isPlannerModal == true) ) && (
            <span id="planner-prev-arrow" onClick={handlePlannerChange}>&#8678;</span>    
          )}
        </div>
        <div>
          <table className="planner-table">
            <thead>
              <tr>
                <th className="empty-column">&nbsp;</th>
                <th className="date-column" colSpan={2}>
                  <div>
                    <span className="planner-weekstart">{planners[plannerId].weekStart}</span>
                  </div>
                </th>
                <th className="date-title" colSpan={3}>
                  <div className="planner-week">
                    <div></div>
                    <div>
                      {weekTitle[plannerId]}
                    </div>
                    <div className="shopping-container">
                      {plannerId <= 1 &&(
                        <button className="shopping-button" onClick={toggleShoppingModal} title={`Liste de courses pour : ${weekTitle[plannerId]}`}><FontAwesomeIcon icon={faBars}/></button>
                      )}
                    </div>
                  </div>
                </th>
                <th className="date-column" colSpan={2}>
                  <div>
                    <span className="planner-weekstart">{planners[plannerId].weekEnd}</span>
                  </div>
                </th>
              </tr>
              <tr>
                {/* Colonne vide avant les jours */}
                <th className="empty-column">
                  <div className="shopping-container">
                    <button className="shopping-button" onClick={toggleShoppingAllModal} title={`Liste de courses pour : ${weekTitle[4]}`}><FontAwesomeIcon icon={faBars}/></button>
                  </div>
                </th>
                {/* Une cellule pour chaque jour */}
                {daysOfWeek.map((dayObj, index) => (
                <th key={index} className="day-column">
                  {dayObj.day}
                </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Premere ligne *Matin* vide */}
              <tr>
                <td className="time-slot-empty">
                  <span className="spacer">&nbsp;</span>
                </td>
                {/* Autres cellules pour chaque jour */}
                {daysOfWeek.map((dayObj, index) => (
                <td key={index} className="morning-cell">
                  <span className="spacer">&nbsp;</span> {/* Span vide pour aligner correctement */}
                </td>
                ))}
                <td className="empty-column"></td>
              </tr>

              {/* Deuxieme ligne *Midi* */}
              <tr>
                {/* Première cellule avec "Midi" */}
                <td className="time-slot midday-slot">
                  <span>Midi</span> {/* Midi centré */}
                </td>
                {/* Autres cellules pour chaque jour */}
                {daysOfWeek.map((dayObj, index) => (
                <td key={index} className="day-cell midday-cell">
                  <div className="button-container">
                    {/* Bouton pour "Midi" */}
                    {(userPlanner[dayObj.keyM]  && userPlanner[dayObj.keyM].length > 0) ? (
                    // Si une recette existe pour ce jour, ne pas afficher le bouton
                    (() => {
                      // Récupérer l'ID de la recette pour ce jour spécifique (par exemple 'monM')
                      const [recipeId, localPortions] = userPlanner[dayObj.keyM];
                      // Utilise cet ID pour récupérer l'objet recette complet dans userRecipes
                      const recipe = userRecipes[recipeId];
                      // Passer la recette en prop à RecipeCardComponent et gérer la suppression
                      if (recipe) {
                        // console.log(dayObj.keyM, compareDates(serverDate, planners[plannerId].weekStart, index), index);
                        return (
                          <RecipeCardComponent
                            key={`${recipe.id}${dayObj.keyM}`}
                            recipe={recipe} // Passer la recette complète en prop
                            // Si on est sur le planner 0 ou 1, on active les features d'ajout/suppression, sinon la vignette sera normale, mais seulement si la date n'est pas encore passée
                            isModal={plannerId <= 1} 
                            isExpired = {!compareDates(serverDate, planners[plannerId].weekStart, index)}
                            cardWidth={cardWidth}
                            chooseMeal={chooseMeal}
                            chooseDay={chooseDay}
                            removeKey={dayObj.keyM}
                            addRecipe = {handleAddRecipe}
                            dataName={`${dayObj.day} midi`}
                            dataKey={dayObj.keyM}
                            localPortions={localPortions}
                            isMarked={(userPlanner[dayObj.keyM])[2]}
                            handleDestock={handleDestock}
                            chooseRecipe={chooseRecipe}
                          />
                        );
                      }
                      return null;
                    })()
                    ) : (
                      plannerId <= 1 && compareDates(serverDate, planners[plannerId].weekStart, index) &&( // Si planner active ou future, on affiche le bouton
                      // Si aucune recette n'est présente, afficher le bouton
                        <CardComponent cardWidth={cardWidth}>
                          <button
                            key={`${dayObj.keyM}`}
                            className="select-button"
                            style={{margin:'auto'}}
                            onClick={() => {handleAddButton(index, dayObj.keyM, dayObj.day)}}
                            data-name={`${dayObj.day} midi`}
                            data-key={dayObj.keyM}
                            disabled={loading}
                          >
                            +
                          </button>
                        </CardComponent>
                      )
                    )}
                  </div>
                </td>
                ))}
              </tr>

              {/* Troisieme ligne *Soir* */}
              <tr>
                {/* Première cellule avec "Soir" */}
                <td className="time-slot evening-slot">
                    <span>Soir</span> {/* Soir aligné en bas */}
                </td>
                {/* Autres cellules pour chaque jour */}
                {daysOfWeek.map((dayObj, index) => (
                <td key={index} className="day-cell evening-cell">
                  <div className="button-container">
                    {/* Bouton pour "Soir" */}
                    {(userPlanner[dayObj.keyE] && userPlanner[dayObj.keyE].length > 0) ? (
                    // Si une recette existe pour ce jour, ne pas afficher le bouton
                    (() => {
                      // Récupérer l'ID de la recette pour ce jour spécifique (par exemple 'monM')
                      const [recipeId, localPortions] = userPlanner[dayObj.keyE];
                      // Utilise cet ID pour récupérer l'objet recette complet dans userRecipes
                      const recipe = userRecipes[recipeId];
                      // Passer la recette en prop à RecipeCardComponent et gérer la suppression
                      if (recipe) {
                        return (
                          <RecipeCardComponent
                            key={`${recipe.id}${dayObj.keyE}`}
                            recipe={recipe} // Passer la recette complète en prop
                            // Si on est sur le planner 0 ou 1, on active les features d'ajout/suppression, sinon la vignette sera normale, mais seulement si la date n'est pas encore passée
                            isModal={plannerId <= 1}
                            isExpired = {!compareDates(serverDate, planners[plannerId].weekStart, index)}
                            cardWidth={cardWidth}
                            chooseMeal={chooseMeal}
                            chooseDay={chooseDay}
                            addRecipe = {handleAddRecipe}
                            removeKey={dayObj.keyE}
                            dataName={`${dayObj.day} midi`}
                            dataKey={dayObj.keyM}
                            localPortions={localPortions} // Passer les portions locales en prop
                            isMarked={(userPlanner[dayObj.keyE])[2]}
                            handleDestock={handleDestock}
                            chooseRecipe={chooseRecipe}
                          />
                        );
                      }
                      return null;
                    })()
                    ) : (
                      plannerId <= 1 && compareDates(serverDate, planners[plannerId].weekStart, index) &&( // Si planner active ou future, on affiche le bouton
                      // Si aucune recette n'est présente, afficher le bouton
                        <CardComponent cardWidth={cardWidth}>
                          <button
                            key={`${dayObj.keyE}`}
                            className="select-button"
                            style={{margin:'auto'}}
                            onClick={() => {handleAddButton(index, dayObj.keyE, dayObj.day)}}
                            data-name={`${dayObj.day} soir`}
                            data-key={dayObj.keyE}
                            disabled={loading}
                          >
                            +
                          </button>
                        </CardComponent>
                      )
                    )}
                  </div>
                </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="planner-next">
          {plannerId > 0 && (
            <span id="planner-next-arrow" onClick={handlePlannerChange}>&#8680;</span>
          )}
        </div>
      </div>
      

      <BaseModal isOpen={isRecipeModalOpen} cardWidth='60%' >
        <RecipeModal dayChoice={dayChoice} chooseDay={chooseDay} cardWidth='60%' chooseMeal={chooseMeal} />
      </BaseModal>

      <BaseModal isOpen={isDetailModalOpen} cardWidth='100%'  bodyWidth={'100%'}>
        <RecipeDetail recipeSlug={recipeSlug} onClose={toggleDetailModal} fromPlanner={true}/>
      </BaseModal>

      <BaseModal isOpen={isShoppingModalOpen} cardWidth='60%'>
        <ShoppingModal onClose={toggleShoppingModal} cardWidth='60%' ingredientList={ingredients} shoppingTitle={weekTitle[plannerId]}/>
      </BaseModal>

      <BaseModal isOpen={isShoppingAllModalOpen} cardWidth='60%'>
        <ShoppingModal onClose={toggleShoppingAllModal} cardWidth='60%' ingredientList={allIngredients} shoppingTitle={weekTitle[4]}/>
      </BaseModal>
    </div>
    </>
    )}
    </>
  );
}

PlannerComponent.propTypes = {
  plannerWidth: PropTypes.string,
  plannerModalClose: PropTypes.func,
  isPlannerModal: PropTypes.bool,
  recipeFromDetail: PropTypes.object
}