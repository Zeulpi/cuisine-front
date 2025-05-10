import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import { BaseModal } from "./Utils/BaseModale";
import { useAppDispatch, useAppSelector } from "../store/reducers/store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import CardComponent from "./Utils/CardComponent";
import LoadingComponent from "./Utils/loadingComponent";
import ShoppingModal from "./User/ShoppingModal";
import { addIngredientToInventory, getFridgeFromServer } from "../utility/FridgeUtils";
import '../styles/User/FridgeComponent.css'

const FridgeComponent = () => {
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
    // lors du changement d'état isLoggedIn, fetch le planner
      setData(retrieveFridge());
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
  }, [userFridge]);

  async function handleAddIngredient (ingredientId, ingredientQty, ingredientUnit) {
    setLoading(true);
    if(ingredientId && ingredientQty && ingredientUnit){
      const message = await addIngredientToInventory(useDispatch, userToken, ingredientId, ingredientQty, ingredientUnit);
      setError(message); // Envoi de l'erreur au state
    } else {
      console.log('Erreur : parametre manquant');
    }
    setLoading(false);
  }

  return (
    <>
      <span>On est dans le FridgeComponent</span>
    </>
  );
};

FridgeComponent.propTypes = {
};

export default FridgeComponent;
