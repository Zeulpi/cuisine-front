import { getData } from '../resources/api-constants'
import { ROUTES } from '../resources/routes-constants'
import { daysOfWeek, getDayIndex } from './dateUtils';
import { useAppSelector } from '../store/reducers/store';
import axios from 'axios'

export function buildRecipeList(rawData){
  const cleanList = {};
  for (let day in rawData) {
    const recipe = rawData[day];
    if (recipe.length > 0) {
        const recipeId = recipe[0]; // L'id de la recette (ex : 77)
        const portions = recipe[1]; // Les portions (ex : 2)
        // Si l'id existe déjà, on ajoute les portions, sinon on l'initialise
        if (cleanList[recipeId]) {
            cleanList[recipeId] += portions;
        } else {
            cleanList[recipeId] = portions;
        }
    }
  }
  return cleanList;
}

export async function getShoppingIngredients (recipes=null, userToken, plannerId=null, destock=0) {
  let errorMessage = null;
  let ingredients = null;
  let allRecipes = {};
  let cleanRecipes = {};
  let portionsById = {};

  const dayIndex = getDayIndex();
  // console.log('plannerId (getshopings) : ', plannerId);

  if (plannerId >= 0) {
    switch (plannerId) {
      case 0:
        cleanRecipes = {...recipes};
        break;
      case 1: {
        cleanRecipes = cleanPastPlannerEntries(recipes, daysOfWeek, dayIndex, destock);
        // console.log('case 1');
        break;
      }
      default:
        break;
    }
    // console.log('recipes : ', recipes);
    // console.log('cleanRecipes : ', cleanRecipes);
    // Objet pour stocker la somme des portions par id
    portionsById = buildRecipeList(cleanRecipes); // Liste des recettes présentes dans le planner actif, avec la somme des portions
  } else {
    // console.log('fetch all');
    allRecipes[0] = recipes[0].recipes;
    allRecipes[1] = cleanPastPlannerEntries(recipes[1].recipes, daysOfWeek, dayIndex);
    // console.log('allRecipes : ', allRecipes);
    
    const list0 = buildRecipeList(allRecipes[0]);
    const list1 = buildRecipeList(allRecipes[1]);

    portionsById = { ...list0 }; 

    for (let id in list1) {
      if (portionsById[id]) {
        portionsById[id] += list1[id]; // Addition si déjà présent
      } else {
        portionsById[id] = list1[id]; // Sinon on ajoute
      }
    }
    // console.log('merged : ', portionsById);
  }

  // console.log('portionsById : ', portionsById);

  if (Object.keys(portionsById).length > 0) {
      try {
          const response = await axios.post(getData(ROUTES.USER_GET_SHOPPING_ROUTE), { 
              token: userToken,
              recipes: portionsById, // Passer l'objet portionsById ici
          });
          
          // Vérification de la réponse et mise à jour du store utilisateur
          if (response.data?.ingredients) {
              // recuperer liste ingredients + qty
              ingredients = response.data.ingredients;
              // console.log('shopping ings : ', ingredients);
          } else {
              errorMessage = response.message || "Erreur lors de la connexion.";
          }
      } catch (error) {
          console.log('Erreur lors de la connexion :', error.response.data);
          errorMessage = "Erreur lors de la connexion.";
      }
  }
  return {errorMessage, ingredients};
}

export function compareCourseWithInventory(courseList, inventoryList) {
  const result = {};

  for (const ingredientId in courseList) {
    const courseItems = courseList[ingredientId];
    const inventoryItems = inventoryList[ingredientId] || [];
    
    result[ingredientId] = courseItems.map(courseItem => {
      const matchingInventory = inventoryItems.find(inv =>
        inv.unit === courseItem.unit
      );

      return {
        ...courseItem,
        inventory: matchingInventory ? matchingInventory.quantity : ""
      };
    });
  }

  return result;
}

export function cleanPastPlannerEntries(plannerData, dayMetaList, dayIndex, destock=0) {
  const updatedPlanner = { ...plannerData };
  // console.log('plannerData : ', plannerData);
  // console.log('updated planner : ', updatedPlanner);

  for (let i = 0; i < dayIndex-destock; i++) {
    const { keyM, keyE } = dayMetaList[i];
    delete updatedPlanner[keyM];
    delete updatedPlanner[keyE];
  }

  return updatedPlanner;
}
