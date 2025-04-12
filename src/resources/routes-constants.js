export const ROUTES = {
    HOMEPAGE_ROUTE: '/',
    RECIPE_ROUTE: '/recipes',
    RECIPE_DETAIL: (id) => `/recipes/${id}`,
    LOGIN_ROUTE: '/login',
    USER_UPDATE_ROUTE: '/user-update',
    USER_REFRESH_ROUTE: '/user-refresh',
    REGISTER_ROUTE: '/user-register',
    TAG_ROUTE: '/tags',
  }

export const RESOURCE_ROUTES = {
    AVATAR_ROUTE: '/images/avatar/',
    RECIPE_IMAGE_ROUTE: '/images/recipes/',
    INGREDIENT_IMAGE_ROUTE: '/images/ingredients/',
    DEFAULT_AVATAR: 'defaut-user.webp',
    DEFAULT_RECIPE_IMAGE: 'defaut-recipe.png',
    DEFAULT_INGREDIENT_IMAGE: 'defaut-ingredient.png',
  }