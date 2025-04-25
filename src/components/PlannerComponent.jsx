import React, { useState, useEffect, use } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import RecipeModal from "./User/RecipeModal";
import { BaseModal } from "./BaseModale";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import RecipeCardComponent from "./Recipe/RecipeCardComponent";
import ShoppingModal from "./User/ShoppingModal";
import { sendPlannerToServer, getPlannersFromServer, removeRecipeFromPlanner } from "../utility/plannerUtils";
import '../styles/User/PlannerComponent.css'

const PlannerComponent = ({ plannerWidth = '40vw', plannerModalClose=null, isPlannerModal=false, recipeFromDetail=null }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false); // true si planner expiré et qu'un nouveau planner a été crée en active
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [dayChoice, setDayChoice] = useState(null);
  const [dayKey, setDayKey] = useState(null);
  const useDispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.auth.token);
  const [plannerId, setPlannerId] = useState(1); // 0 = planner a venir, 1 = planner actif, 2 = planner -1 semaines, 3 = planner -2 semaines
  const planners = useAppSelector(state => state.auth.userPlanner);
  let userPlanner = planners[plannerId].recipes ; // Récupérer le planner actif de l'utilisateur
  const userRecipes = useAppSelector(state => state.recipe.recipes);
  const daysOfWeek = [
    { day: "Lundi", keyM: "monM", keyE: "monE" },   // Lundi midi et soir
    { day: "Mardi", keyM: "tueM", keyE: "tueE" },   // Mardi midi et soir
    { day: "Mercredi", keyM: "wedM", keyE: "wedE" }, // Mercredi midi et soir
    { day: "Jeudi", keyM: "thuM", keyE: "thuE" },   // Jeudi midi et soir
    { day: "Vendredi", keyM: "friM", keyE: "friE" }, // Vendredi midi et soir
    { day: "Samedi", keyM: "satM", keyE: "satE" },   // Samedi midi et soir
    { day: "Dimanche", keyM: "sunM", keyE: "sunE" }, // Dimanche midi et soir
  ];

  useEffect(() => { // Vérification de la connexion de l'utilisateur
    if (!isLoggedIn) {
      navigate("/"); // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
    } else {
      setLoading(true);
      const response = getPlannersFromServer(userToken, useDispatch); // si connecté, on va chercher les planners sur le serveur
      response == 'updated' ? setUpdated(true) : null;
      
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);
  

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


  const toggleRecipeModal = () => {
    setIsRecipeModalOpen(!isRecipeModalOpen);
  }
  const toggleShoppingModal = () => {
    setIsShoppingModalOpen(!isShoppingModalOpen);
  }

  const handleAddRecipe = (keyWord, recipe, portions) => { // ajouter un couple jour/recette au planner actif dans le store
    if(keyWord && recipe){
      // console.log('planner id : ', plannerId);
      const message = sendPlannerToServer(keyWord, recipe, portions, useDispatch, userToken, plannerId); // Envoi de la recette au serveur
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : clé du jour ou recette manquante.');
    }
  };

  const handleRemoveRecipe = (keyWord) => {
    if(keyWord){
      const message = removeRecipeFromPlanner(keyWord, useDispatch, userToken, plannerId); // Envoi de la recette au serveur
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : clé du jour ou recette manquante.');
    }
  };

  const chooseDay = (name=null, key=null) => {
    // console.log(name, key);
    
    if (name && key) {
      setDayChoice(name);
      setDayKey(key);
      console.log(`Recette choisie pour ${name} :`, key);
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
      {updated && (
        <div className="planner-update">Nouvelle semaine : Planner mis a jour &nbsp; <button onClick={()=>{setUpdated(false)}}>X</button></div>
      )}
      <div className="planner-frame">
        <div className="planner-prev">
          {((plannerId < 3 && isPlannerModal == false) || (plannerId < 1 && isPlannerModal == true) ) && (
            <span className="planner-prev-arrow" onClick={()=>{plannerId < 3 ? setPlannerId((plannerId+1)) : null}}>&#8678;</span>    
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
                        return (
                            <RecipeCardComponent
                              key={`${recipe.id}${dayObj.keyM}`}
                              recipe={recipe} // Passer la recette complète en prop
                              isModal={plannerId <= 1} // Si on est sur le planner 0 ou 1, on active les features d'ajout/suppression, sinon la vignette sera normale
                              cardWidth="150px"
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
                      plannerId <= 1 && ( // Si planner active ou future, on affiche le bouton
                      // Si aucune recette n'est présente, afficher le bouton
                      <button
                        key={`${dayObj.keyM}`}
                        className="select-button"
                        onClick={() => {isPlannerModal ? handleAddRecipe(dayObj.keyM, recipeFromDetail, recipeFromDetail.portions) : chooseDay(`${dayObj.day} midi`, dayObj.keyM)}}
                        data-name={`${dayObj.day} midi`}
                        data-key={dayObj.keyM}
                      >
                        +
                      </button>
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
                              isModal={plannerId <= 1} // Si on est sur le planner 0 ou 1, on active les features d'ajout/suppression, sinon la vignette sera normale
                              cardWidth="150px"
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
                      plannerId <= 1 && ( // Si planner active ou future, on affiche le bouton
                      // Si aucune recette n'est présente, afficher le bouton
                      <button
                        key={`${dayObj.keyE}`}
                        className="select-button"
                        onClick={() => {isPlannerModal ? handleAddRecipe(dayObj.keyE, recipeFromDetail, recipeFromDetail.portions) : chooseDay(`${dayObj.day} soir`, dayObj.keyE)}}
                        data-name={`${dayObj.day} soir`}
                        data-key={dayObj.keyE}
                      >
                        +
                      </button>
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
          {plannerId>0 && (
            <span className="planner-next-arrow" onClick={()=>{plannerId > 0 ? setPlannerId((plannerId-1)) : null}}>&#8680;</span>
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
};

PlannerComponent.propTypes = {
  plannerWidth: PropTypes.string,
  plannerModalClose: PropTypes.func,
  isPlannerModal: PropTypes.bool,
  recipeFromDetail: PropTypes.object
};

export default PlannerComponent;
