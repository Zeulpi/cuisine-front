import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import {RecipeModal} from "./User/RecipeModal";
import { BaseModal } from "./Utils/BaseModale";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import RecipeCardComponent from "./Recipe/RecipeCardComponent";
import LoadingComponent from "./Utils/loadingComponent";
import ShoppingModal from "./User/ShoppingModal";
import { sendPlannerToServer, getPlannersFromServer, removeRecipeFromPlanner } from "../utility/plannerUtils";
import {getServerTime, compareDates} from "../utility/dateUtils";
import '../styles/User/PlannerComponent.css'
import {CardComponent} from "./Utils/CardComponent";

export function PlannerComponent({ plannerWidth = '40vw', plannerModalClose=null, isPlannerModal=false, recipeFromDetail=null }) {
  const cardWidth = "150px";
  const useDispatch = useAppDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false); // true si planner expiré et qu'un nouveau planner a été crée en active
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page
  const [dayChoice, setDayChoice] = useState(null);
  const [dayKey, setDayKey] = useState(null);
  const userToken = useSelector((state) => state.auth.token);
  const [plannerId, setPlannerId] = useState(1); // 0 = planner a venir, 1 = planner actif, 2 = planner -1 semaine, 3 = planner -2 semaines
  const planners = useSelector(state => state.auth.userPlanner);
  let userPlanner = planners[plannerId].recipes ; // Récupérer le planner actif de l'utilisateur
  const userRecipes = useSelector(state => state.recipe.recipes);
  const serverDate = getServerTime();
  const daysOfWeek = [
    { day: "Lundi", keyM: "monM", keyE: "monE" },   // Lundi midi et soir
    { day: "Mardi", keyM: "tueM", keyE: "tueE" },   // Mardi midi et soir
    { day: "Mercredi", keyM: "wedM", keyE: "wedE" }, // Mercredi midi et soir
    { day: "Jeudi", keyM: "thuM", keyE: "thuE" },   // Jeudi midi et soir
    { day: "Vendredi", keyM: "friM", keyE: "friE" }, // Vendredi midi et soir
    { day: "Samedi", keyM: "satM", keyE: "satE" },   // Samedi midi et soir
    { day: "Dimanche", keyM: "sunM", keyE: "sunE" }, // Dimanche midi et soir
  ];

  async function retrievePlanner() {
    if (!isLoggedIn) {
      navigate("/"); // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
    } else {
      setLoading(true);
      const response = await getPlannersFromServer(userToken, useDispatch); // si connecté, on va chercher les planners sur le serveur
      setLoading(false);
      return response;
    }
  }

  useEffect(() => { // Vérification de la connexion de l'utilisateur
    // lors du changement d'état isLoggedIn, fetch le planner
      setData(retrievePlanner());
      data == 'updated' ? setUpdated(true) : null;
  }, [isLoggedIn, navigate]);
  
  // quand les données du planner changent => re-render
  useEffect(()=>{
    // console.log(data);
  }, [data]);

  useEffect(() => {
    const adjustTableSize = () => { // Ajustement dynamique de la largeur des colonnes
      const card = document.querySelector('.recipe-card');
      const dayCells = document.querySelectorAll('.day-cell');
      let maxWidth = 0;
      
      const adjustAllColumns = () => {
        dayCells.forEach(cell => { // Trouver la colonne la plus large
          maxWidth = Math.max(maxWidth, cell.offsetWidth);
        });
      };
      
      if (card){  // Si une carte est presente dans le tableau, toutes les colonnes prennent la largeur de la carte
        dayCells.forEach(cell => {
          cell.style.width = `${card.offsetWidth}px`;
        });
        // console.log('card presente');
      } else { // Si pas de carte, reset toutes les colonnes au mini, puis ajustement en fonction de la plus large
        maxWidth = 0; // Réinitialiser maxWidth
        dayCells.forEach(cell => { // reset de toutes les largeurs de colonnes
          cell.style.width = 'auto';
        });
        adjustAllColumns(); // Trouver la colonne la plus large
        dayCells.forEach(cell => {
          cell.style.width = `${maxWidth}px`; 
        });
        // console.log('card absente');
      }
    };
    window.addEventListener("load", adjustTableSize);
    window.addEventListener("resize", adjustTableSize);
    adjustTableSize(); // initial call

    // Nettoyage des écouteurs d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("load", adjustTableSize);
      window.removeEventListener("resize", adjustTableSize);
    };
  }, [userPlanner, userRecipes]);

  useEffect(() => { // Ouverture de la modale si un jour est choisi (click bouton +)
    dayChoice !== null ? setIsRecipeModalOpen(true) : setIsRecipeModalOpen(false);
  }, [dayChoice]);

  useEffect(()=>{
    plannerId <= 1 ? compareDates(serverDate, (planners[plannerId].weekStart)) : null;
  }, [plannerId]);

  const toggleRecipeModal = () => {
    setIsRecipeModalOpen(!isRecipeModalOpen);
  }
  const toggleShoppingModal = () => {
    setIsShoppingModalOpen(!isShoppingModalOpen);
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

  return (
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
                <div>
                  {(() => {
                    switch (plannerId) {
                      case 0:
                        return "Semaine prochaine";
                      case 1:
                        return "Semaine actuelle";
                      case 2:
                        return "Il y a 1 semaine";
                      case 3:
                        return "Il y a 2 semaines";
                      default:
                        return "";
                    }
                  })()}
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
                  {plannerId <= 1 &&(
                    <div className="shopping-container">
                      <button className="shopping-button" onClick={toggleShoppingModal}><FontAwesomeIcon icon={faBars} /></button>
                    </div>
                  )}
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
                        // console.log(dayObj.keyM, compareDates(serverDate, planners[plannerId].weekStart, index));
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

      <BaseModal isOpen={isShoppingModalOpen} cardWidth='60%'>
        <ShoppingModal onClose={toggleShoppingModal} cardWidth='60%' shoppingIndex={plannerId} />
      </BaseModal>
    </div>
  );
}

PlannerComponent.propTypes = {
  plannerWidth: PropTypes.string,
  plannerModalClose: PropTypes.func,
  isPlannerModal: PropTypes.bool,
  recipeFromDetail: PropTypes.object
}