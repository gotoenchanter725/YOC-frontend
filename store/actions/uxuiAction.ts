import { LOADING_END, LOADING_START, ALERT_SHOW, ALERT_HIDDEN } from "../types";

export const loading_start = () => (dispatch: any) => {
    dispatch({
        type: LOADING_START
    })
}

export const loading_end = () => (dispatch: any) => {
    dispatch({
        type: LOADING_END
    })
}

export const alert_show = (param: any) => (dispatch: any) => {
    dispatch({
        type: ALERT_SHOW, 
        payload: {
            content: param.content, 
            text: param.text, 
            status: param.status
        }
    })
}

export const alert_hidden = () => (dispatch: any) => {
    dispatch({
        type: ALERT_HIDDEN
    })
}