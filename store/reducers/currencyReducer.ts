import {
  CURRENCY_RETIREVEING,
  CURRENCY_UPDATE,
  CURRENCY_ERROR,
} from "../types";

const initialState = {
  data: [],
  loading: 0,
  error: false
};

const currencyReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CURRENCY_RETIREVEING:
      return {
        ...state,
        data: [],
        loading: 1
      };
    case CURRENCY_UPDATE:
      return {
        ...state,
        data: [...action.payload],
        loading: 2
      };
    case CURRENCY_ERROR:
      return {
        ...state,
        data: [],
        loading: 2,
        error: true
      };
    default:
      return state;
  }
};

export default currencyReducer;