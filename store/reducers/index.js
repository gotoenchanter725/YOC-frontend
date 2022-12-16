import { combineReducers } from "redux";
import infoReducer from "./infoReducer";
import uxuiReducer from "./uxuiReducer";

export default combineReducers({
  data: infoReducer,
  uxuiData: uxuiReducer
});
