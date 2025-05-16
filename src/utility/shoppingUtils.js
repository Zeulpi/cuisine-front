import { getData } from '../resources/api-constants'
import { ROUTES } from '../resources/routes-constants'
import axios from 'axios'


export async function getShoppingIngredients (recipes, userToken) {
    let errorMessage = null;
    let ingredients = null;

    // Objet pour stocker la somme des portions par id
    const portionsById = {}; // Liste des recettes présentes dans le planner actif, avec la somme des portions

    // Parcours de chaque jour de la semaine (les clés comme 'monM', 'tueE', etc.)
    for (let day in recipes) {
        const recipe = recipes[day];
        
        if (recipe.length > 0) {
            const recipeId = recipe[0]; // L'id de la recette (ex : 77)
            const portions = recipe[1]; // Les portions (ex : 2)
            
            // Si l'id existe déjà, on ajoute les portions, sinon on l'initialise
            if (portionsById[recipeId]) {
                portionsById[recipeId] += portions;
            } else {
                portionsById[recipeId] = portions;
            }
        }
    }

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
    
    return {errorMessage, ingredients: ingredients};
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

export function cleanPastPlannerEntries(plannerData, dayMetaList, dayIndex) {
  const updatedPlanner = { ...plannerData };

  for (let i = 0; i < dayIndex; i++) {
    const { keyM, keyE } = dayMetaList[i];
    delete updatedPlanner[keyM];
    delete updatedPlanner[keyE];
  }

  return updatedPlanner;
}
