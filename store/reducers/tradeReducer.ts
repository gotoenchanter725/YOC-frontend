import {
    PROJECT_RETIREVEING,
    PROJECT_UPDATE,
    PROJECT_ERROR,
    MY_ORDER_RETIREVEING,
    MY_ORDER_UPDATE,
    MY_ORDER_ERROR,
} from "../types";

const initialState = {
    projects: {
        data: [],
        loading: 0,
        error: false
    },
    myOrders: {
        data: [],
        loading: 0,
        error: false
    }
};

const tradeReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case PROJECT_RETIREVEING:
            return {
                ...state,
                projects: {
                    data: [],
                    loading: 1
                }
            };
        case PROJECT_UPDATE:
            return {
                ...state,
                projects: {
                    data: [...action.payload],
                    loading: 2
                }
            };
        case PROJECT_ERROR:
            return {
                ...state,
                projects: {
                    data: [],
                    loading: 2,
                    error: true
                }
            };
        case MY_ORDER_RETIREVEING:
            return {
                ...state,
                myOrders: {
                    data: [],
                    loading: 1
                }
            };
        case MY_ORDER_UPDATE:
            return {
                ...state,
                myOrders: {
                    data: [...action.payload],
                    loading: 2
                }
            };
        case MY_ORDER_ERROR:
            return {
                ...state,
                myOrders: {
                    data: [],
                    loading: 2,
                    error: true
                }
            };
        default:
            return state;
    }
};

export default tradeReducer;