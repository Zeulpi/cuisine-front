import React, { useState, useEffect, use } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import RecipeModal from "./User/RecipeModal";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { setPlannerRecipe } from "../store/actions/auth";
import { setRecipe, removeRecipe, setAllRecipes } from "../store/actions/recipe";
import RecipeCardComponent from "./Recipe/RecipeCardComponent";
import { sendPlannerToServer, getPlannersFromServer, removeRecipeFromPlanner } from "../utility/plannerUtils";
import { ROUTES } from "../resources/routes-constants";
import { getData } from "../resources/api-constants";
import { getUserFromToken } from "../utility/getUserFromToken";
import { setUser } from "../store/actions/auth";
import axios from "axios";
import { customFetch } from "../utility/customFetch";
import '../styles/User/PlannerComponent.css'

const PlannerComponent = ({ plannerWidth = '40vw' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [dayChoice, setDayChoice] = useState(null);
  const [dayKey, setDayKey] = useState(null);
  const useDispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.auth.token);
  const userPlanner = useAppSelector(state => state.auth.userPlanner[0].recipes);
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
      getPlannersFromServer(userToken, useDispatch); // si connecté, on va chercher les planners sur le serveur
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
    dayChoice !== null ? setIsModalOpen(true) : setIsModalOpen(false);
  }, [dayChoice]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleAddRecipe = (keyWord, recipe, portions) => { // ajouter un couple jour/recette au planner actif dans le store
    if(keyWord && recipe){
      const message = sendPlannerToServer(keyWord, recipe, portions, useDispatch, userToken); // Envoi de la recette au serveur
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : clé du jour ou recette manquante.');
    }
  };

  const handleRemoveRecipe = (keyWord) => {
    if(keyWord){
      const message = removeRecipeFromPlanner(keyWord, useDispatch, userToken); // Envoi de la recette au serveur
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
    }
    else {
      setDayChoice(null);
      setDayKey(null);
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
      <table className="planner-table">
        <thead>
          <tr>
            {/* Colonne vide avant les jours */}
            <th className="empty-column">&nbsp;</th>
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
                  const [recipeId, portions] = userPlanner[dayObj.keyM];
                  // Utilise cet ID pour récupérer l'objet recette complet dans userRecipes
                  const recipe = userRecipes[recipeId];
                  // Passer la recette en prop à RecipeCardComponent et gérer la suppression
                  if (recipe) {
                    return (
                        <RecipeCardComponent
                          key={`${recipe.id}${dayObj.keyM}`}
                          recipe={recipe} // Passer la recette complète en prop
                          isModal={true}
                          cardWidth="150px"
                          chooseMeal={chooseMeal}
                          chooseDay={chooseDay}
                          removeKey={dayObj.keyM}
                          dataName={`${dayObj.day} midi`}
                          dataKey={dayObj.keyM}
                        />
                    );
                  }
                  return null;
                })()
                ) : (
                // Si aucune recette n'est présente, afficher le bouton
                <button
                  key={`${dayObj.keyM}`}
                  className="select-button"
                  onClick={() => {chooseDay(`${dayObj.day} midi`, dayObj.keyM)}}
                  data-name={`${dayObj.day} midi`}
                  data-key={dayObj.keyM}
                >
                  +
                </button>
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
                  const [recipeId, portions] = userPlanner[dayObj.keyE];
                  // Utilise cet ID pour récupérer l'objet recette complet dans userRecipes
                  const recipe = userRecipes[recipeId];
                  // Passer la recette en prop à RecipeCardComponent et gérer la suppression
                  if (recipe) {
                    return (
                        <RecipeCardComponent
                          key={`${recipe.id}${dayObj.keyE}`}
                          recipe={recipe} // Passer la recette complète en prop
                          isModal={true}
                          cardWidth="150px"
                          chooseMeal={chooseMeal}
                          chooseDay={chooseDay}
                          removeKey={dayObj.keyE}
                          dataName={`${dayObj.day} midi`}
                          dataKey={dayObj.keyM}
                        />
                    );
                  }
                  return null;
                })()
                ) : (
                // Si aucune recette n'est présente, afficher le bouton
                <button
                  key={`${dayObj.keyE}`}
                  className="select-button"
                  onClick={() => {chooseDay(`${dayObj.day} soir`, dayObj.keyE)}}
                  data-name={`${dayObj.day} soir`}
                  data-key={dayObj.keyE}
                >
                  +
                </button>
                )}
              </div>
            </td>
            ))}
          </tr>
        </tbody>
      </table>

      <RecipeModal isOpen={isModalOpen} onClose={toggleModal} dayChoice={dayChoice} chooseDay={chooseDay} cardWidth='60%' chooseMeal={chooseMeal} />
    </div>
  );
};

PlannerComponent.propTypes = {
  plannerWidth: PropTypes.string
};

export default PlannerComponent;
