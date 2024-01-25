import { combineReducers } from "redux";
import infoReducer from "./infoReducer";
import uxuiReducer from "./uxuiReducer";
import tradeReducer from "./tradeReducer";
import currencyReducer from "./currencyReducer";

export default combineReducers({
  data: infoReducer,
  uxuiData: uxuiReducer,
  trade: tradeReducer,
  currencyData: currencyReducer,
});