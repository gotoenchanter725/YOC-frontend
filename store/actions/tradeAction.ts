import {
    PROJECT_RETIREVEING,
    PROJECT_UPDATE,
    PROJECT_ERROR,
    MY_ORDER_RETIREVEING,
    MY_ORDER_UPDATE,
    MY_ORDER_ERROR,
} from "../types";

export const retireveingProject = () => (dispatch: any) => {
    dispatch({
        type: PROJECT_RETIREVEING
    })
}

export const updateProject = (data: any[]) => (dispatch: any) => {
    dispatch({
        type: PROJECT_UPDATE,
        payload: [...data]
    })
}

export const errorProject = () => (dispatch: any) => {
    dispatch({
        type: PROJECT_ERROR
    })
}


export const retireveingMyOrder = () => (dispatch: any) => {
    dispatch({
        type: MY_ORDER_RETIREVEING
    })
}

export const updateMyOrder = (data: any[]) => (dispatch: any) => {
    dispatch({
        type: MY_ORDER_UPDATE,
        payload: [...data]
    })
}

export const errorMyOrder = () => (dispatch: any) => {
    dispatch({
        type: MY_ORDER_ERROR
    })
}