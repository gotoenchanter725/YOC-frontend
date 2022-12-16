import { LOADING_END, LOADING_START, ALERT_SHOW, ALERT_HIDDEN } from "../types";

export const loading_start = () => (dispatch) => {
    dispatch({
        type: LOADING_START
    })
}

export const loading_end = () => (dispatch) => {
    dispatch({
        type: LOADING_END
    })
}

export const alert_show = (param) => (dispatch) => {
    dispatch({
        type: ALERT_SHOW, 
        payload: {
            content: param.content, 
            status: param.status
        }
    })
}

export const alert_hidden = () => (dispatch) => {
    dispatch({
        type: ALERT_HIDDEN
    })
}