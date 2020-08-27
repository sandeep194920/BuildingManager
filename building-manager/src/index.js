import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware, compose } from "redux"; // applyMiddleware is a function that returns a store enhancer which is used to connect thunk to store. compose is used to combine multiple store enhancers. applyMiddleware is one such store enhancer
import rootReducer from "./store/reducers/rootReducer"; // this has all the reducers
import { Provider } from "react-redux"; // this lets the app to have access to redux store. This binds react to redux store
import thunk from "redux-thunk"; // thunk is used to dispatch async action creators (to halt the dispatch for sometime)
import firebase from "firebase/app"; // this is required in rrfProps
// these two below, getFirebase and getFirestore are used so that our app can directly interact with firebase and firestore db. We can use it without this as well but this is a good practice
import {
  reduxFirestore,
  getFirestore,
  createFirestoreInstance,
} from "redux-firestore"; // reduxFirestore is a store enhancer to which we pass our firebase config so that getFirestore knows what to connect to in async action creator
import {
  ReactReduxFirebaseProvider,
  getFirebase,
  isLoaded,
} from "react-redux-firebase"; // reactReduxFirebase is a store enhancer to which we pass our firebase config so that getFirebase knows what to connect to in async action creator
import fbConfig from "./configs/fbConfig"; // this is passed into reduxFirestore store enhancer
import { useSelector } from "react-redux";

// this is used so that the app gets loaded only when the firebase auth is ready
function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) return <div>splash screen...</div>;
  return children;
}

//create store and then pass root reducer into it. middleware is used to hold thunk and thunk is the function to dispatch async action creators
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })), // since we are using extra arguments, we can use them (getFirebase and getFirestore) in async action creators inside arguments along with dispatch argument
    reduxFirestore(fbConfig)
    // reactReduxFirebase(firebase) // this is deprecated in v3.0.0 of react-redux-firebase
  )
);
// setting up react redux firebase props
const rrfProps = {
  firebase, // imported from 'firebase/app'
  config: fbConfig, //our firebase config
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  // provider below binds react to redux
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <AuthIsLoaded>
        <App />
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
