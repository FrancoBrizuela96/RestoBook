import {
  ADD_EMPRESA,
  EMPRESA_DETAIL,
  ADD_MENU,
  CURRENT_USER,
  CURRENT_ID,
  SET_COMMERCE,
  USER_FAVOURITES,
  SET_USER_LOCATION
} from "./Actions/Constants.js";

let initialState = {
  empresas: [],
  menus: [],
  commerce: false,
  currentId: null,
  currentUser: {},
  empresaDetail: [],
  userCoordinates: {},
  favourites: [],
  categoriesResto: [
    "Pizzas/Empanadas",
    "Rotiseria",
    "Pastas",
    "Parrilla",
    "Sushi",
    "Hamburguesas",
    "Fingerfood",
    "Drinks",
    "Otros",
  ],
  categoriesMenu: [
    "Pizza",
    "Pasta",
    "Bebida",
    "Guarnicion",
    "Postre",
    "Plato Principal",
  ],
  sectoresResto: [
    "Terraza",
    "Salón Principal",
    "Patio",
    "Vereda",
  ],

};

const RootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MENU:
      const menu = action.payload;
      return {
        ...state,
        menus: [...state.menus, menu],
      };
    case EMPRESA_DETAIL:
      const empresaDetail = action.payload;
      //console.log(dataEmpresa[0])
      return {
        ...state,
        empresaDetail: empresaDetail,
      };
    case ADD_EMPRESA:
      return {
        ...state,
        empresas: [...state.empresas, action.payload],
      };
    case CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case CURRENT_ID:
      return {
        ...state,
        currentId: action.payload,
      };
    case SET_COMMERCE:
      return {
        ...state,
        commerce: true,
      };
    case USER_FAVOURITES:
      return {
        ...state,
        favourites: action.payload,
      };
    case SET_USER_LOCATION:
      return {
        ...state,
        userCoordinates: action.payload
      }
      default:
      return state;
  }
};

export default RootReducer;
