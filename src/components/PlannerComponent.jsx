import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import RecipeModal from "./User/RecipeModal";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { setPlannerRecipe } from "../store/actions/auth";
import { setRecipe, removeRecipe } from "../store/actions/recipe";
import RecipeCardComponent from "./Recipe/RecipeCardComponent";
import '../styles/User/PlannerComponent.css'

const PlannerComponent = ({ plannerWidth = '40vw' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();  // Récupérer l'objet navigate pour la navigation
  const location = useLocation(); // Récupérer l'URL actuelle de la page
  const [showModal, setShowModal] = useState(false);
  const [dayChoice, setDayChoice] = useState(null);
  const [dayKey, setDayKey] = useState(null);
  const useDispatch = useAppDispatch();
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

   
   useEffect(() => { // useEffect pour détecter les changements de userPlanner
    // Ajustement dynamique de la largeur des colonnes
    const adjustTableSize = () => {
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
  

    // Remplissage automatique du store recipes avec les recettes du planner
    userPlanner.forEach(entry => {
      Object.entries(entry).forEach(([key, recipeId]) => {
        if (recipeId !== null && recipeId !== '') {
          // console.log(`Recette trouvée pour ${key} : ${recipeId}`);
          
          const recipe = userRecipes.find(recipe => recipe.id === recipeId);
          if (!recipe) {
            console.log(`Recette introuvable pour ${key} : ${recipeId}`);
          //   useDispatch(setRecipe({id: recipe.id, name: recipe.name, image: recipe.image, portions: recipe.portions, tags: recipe.tags}));
          }
        }
      });
    });


    // Nettoyage des écouteurs d'événements lors du démontage du composant
    return () => {
      window.removeEventListener("load", adjustTableSize);
      window.removeEventListener("resize", adjustTableSize);
    };
  }, [userPlanner, userRecipes]);

  useEffect(() =>{
    // console.log(dayChoice);
    dayChoice !== null ? setIsModalOpen(true) : setIsModalOpen(false);
  }, [dayChoice]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    // setDayChoice(null);
    // setDayKey(null);
  }

  const handleAddRecipe = (keyWord, recipe) => { // ajouter un couple jour/recette au planner actif dans le store
    if(keyWord && recipe){
      useDispatch(setPlannerRecipe({ keyword: keyWord, recipeId: recipe.id }));
      // console.log('Recette ajoutée au planner :', recipe);
      useDispatch(setRecipe(recipe));
    } else {
      console.log('Erreur : clé du jour ou recette manquante.');
    }
  };

  const handleRemoveRecipe = (recipeId, keyword) => {
    // 1. Supprimer l'entrée du planner avec keyword et recipeId = null
    useDispatch(setPlannerRecipe({ keyword, recipeId: null }));
    
    // 2. Compter combien de fois recipeId est utilisé dans le planner
    // si plus de 1 fois c'est que la recette est présente ailleurs
    // 1 fois et pas 0, c'est parce que react-redux n'a pas encore eu le temps d'effectuer le dispatch pour enlever le repas du planner (cf etape 1 juste au dessus)
    let occurrences=null;
    setTimeout(() => {
      occurrences = userPlanner.reduce((count, entry) => {
        // Parcourir les valeurs dans chaque entrée de userPlanner
        Object.values(entry).forEach(id => {
          if (id === recipeId) {
            count += 1;
          }
        });
        return count;
      }, 0); // Initialiser à 0
    },200);
    // console.log(keyword);
    // console.log('planner :', userPlanner);
    // console.log('Nombre d\'occurrences de cette recette :', occurrences);
    
    setTimeout(() => {
      // 3. Si la recette n'est plus utilisée ailleurs, la supprimer du store des recettes
      if (occurrences <= 1 || occurrences === null) {
        // console.log('suppression de : ', recipeId);
        useDispatch(removeRecipe({ id: recipeId }));
      } else {
        // console.log('La recette est utilisée ailleurs dans le planner, elle ne sera pas supprimée.');
      }
    },400);
  };

  const chooseDay = (name=null, key=null) => {
    console.log(name, key);
    
    if (name && key) {
      setDayChoice(name);
      setDayKey(key);
    }
    else {
      setDayChoice(null);
      setDayKey(null);
    }
  }

  const chooseMeal = (recipe, key=null) => {
    if (dayKey && recipe && key === null) { 
      handleAddRecipe(dayKey, recipe);
      // console.log(`Recette ajoutée pour ${dayKey} :`, recipe);
    } else if (recipe && key) { // Si une recette est déjà présente, on la remplace
      handleRemoveRecipe(recipe.id, key); // Supprimer l'ancienne recette
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
                {userPlanner.some(entry => entry[dayObj.keyM] && entry[dayObj.keyM] !== '' && entry[dayObj.keyM] !== null) ? (
                // Si une recette existe pour ce jour, ne pas afficher le bouton
                (() => {
                  // Récupérer l'ID de la recette pour ce jour spécifique (par exemple 'monM')
                  const recipeId = userPlanner.find(entry => entry[dayObj.keyM])?.[dayObj.keyM];
                  // Utilise cet ID pour récupérer l'objet recette complet dans userRecipes
                  const recipe = userRecipes.find(recipe => recipe.id === recipeId);
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
                {userPlanner.some(entry => entry[dayObj.keyE] && entry[dayObj.keyE] !== '' && entry[dayObj.keyE] !== null) ? (
                // Si une recette existe pour ce jour, ne pas afficher le bouton
                (() => {
                  // Récupérer l'ID de la recette pour ce jour spécifique (par exemple 'monM')
                  const recipeId = userPlanner.find(entry => entry[dayObj.keyE])?.[dayObj.keyE];
                  // Utilise cet ID pour récupérer l'objet recette complet dans userRecipes
                  const recipe = userRecipes.find(recipe => recipe.id === recipeId);
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
