import { LOADING_START, LOADING_END, ALERT_SHOW, ALERT_HIDDEN } from "../types";

const initialState = {
    loading: false, 
    alertModal: false, 
    alertType: 'success', 
    alertContent: '',
};

const uxuiReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case LOADING_START:
            return {
                ...state,
                loading: true
            };
        case LOADING_END:
            return {
                ...state,
                loading: false
            };
        case ALERT_SHOW:
            return {
                ...state, 
                alertModal: true, 
                alertType: action.payload.status, 
                alertContent: action.payload.content
            }
        case ALERT_HIDDEN:
            return {
                ...state, 
                alertModal: false
            }
        default:
            return state;
    }
};

export default uxuiReducer;