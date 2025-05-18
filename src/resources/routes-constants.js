export const baseUrl = 'http://localhost:8000'

export const ROUTES = {
    HOMEPAGE_ROUTE: '/',
    RECIPE_ROUTE: '/recipes',
    RECIPE_DETAIL: (id) => `/recipes/${id}`,
    LOGIN_ROUTE: '/login',
    USER_UPDATE_ROUTE: '/user-update',
    USER_REFRESH_ROUTE: '/user-refresh',
    USER_SEND_PLANNER_ROUTE: '/user-planner-addrecipe',
    USER_DELETE_PLANNER_ROUTE: '/user-planner-deleterecipe',
    USER_GET_PLANNER_ROUTE: '/user-planner-get',
    USER_MARK_PLANNER_ROUTE: '/user-planner-setmark',
    USER_GET_SHOPPING_ROUTE: '/user-shopping-get',
    USER_GET_ALL_SHOPPING_ROUTE: '/user-shopping-getall',
    USER_ADD_FRIDGE_ROUTE: '/user-fridge-addtofridge',
    USER_ADD_FRIDGE_LIST_ROUTE: '/user-fridge-addlisttofridge',
    USER_GET_FRIDGE_ROUTE: '/user-fridge-getfridge',
    USER_GET_INGREDIENTS_ROUTE: '/user-fridge-getingredients',
    REGISTER_ROUTE: '/user-register',
    TAG_ROUTE: '/tags',
  }

export const RESOURCE_ROUTES = {
    GLOBAL_IMAGE_ROUTE: '/images/',
    AVATAR_ROUTE: '/images/avatar/',
    RECIPE_IMAGE_ROUTE: '/images/recipes/',
    INGREDIENT_IMAGE_ROUTE: '/images/ingredients/',
    DEFAULT_AVATAR: 'defaut-user.webp',
    DEFAULT_RECIPE_IMAGE: 'defaut-recipe.png',
    DEFAULT_INGREDIENT_IMAGE: 'defaut-ingredient.png',
    DEFAULT_FEATURE_IMAGE: 'default-feature.png',
  }