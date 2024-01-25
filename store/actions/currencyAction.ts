import {
  CURRENCY_RETIREVEING,
  CURRENCY_UPDATE,
  CURRENCY_ERROR,
} from "../types";


export const retireveingCurrency = () => (dispatch: any) => {
  dispatch({
    type: CURRENCY_RETIREVEING
  })
}

export const updateCurrency = (data: any[]) => (dispatch: any) => {
  dispatch({
    type: CURRENCY_UPDATE,
    payload: [...data]
  })
}

export const errorCurrency = () => (dispatch: any) => {
  dispatch({
    type: CURRENCY_ERROR
  })
}