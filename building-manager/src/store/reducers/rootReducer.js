// this combines all the reducers and hence this is called root reducer

import authReducer from "./authReducer";
import { combineReducers } from "redux"; // to combine all the reducers

const rootReducer = combineReducers({
  authReducer: authReducer,
});

export default rootReducer;
