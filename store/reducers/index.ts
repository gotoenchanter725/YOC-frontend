import { combineReducers } from "redux";
import infoReducer from "./infoReducer";
import uxuiReducer from "./uxuiReducer";
import tradeReducer from "./tradeReducer";

export default combineReducers({
  data: infoReducer,
  uxuiData: uxuiReducer,
  trade: tradeReducer,
});