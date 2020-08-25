// this combines all the reducers and hence this is called root reducer

import authReducer from "./authReducer";
import { combineReducers } from "redux"; // to combine all the reducers
import { firestoreReducer } from "redux-firestore"; // this is the reducer given by firestore which syncs the local state with the firestore data. If this wasn't present then we need to get the data from firestore in action creator and then pass it on to our own reducer
import { firebaseReducer } from "react-redux-firebase"; // this is the reducer given by firebase and we can use it for auth and other things here

const rootReducer = combineReducers({
  auth: authReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;
