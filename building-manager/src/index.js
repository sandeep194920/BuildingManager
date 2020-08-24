import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware } from "redux"; // applyMiddleware is a function used to connect thunk to store
import rootReducer from "./store/reducers/rootReducer"; // this has all the reducers
import { Provider } from "react-redux"; // this lets the app to have access to redux store. This binds react to redux store
import thunk from "redux-thunk"; // thunk is used to dispatch async action creators (to halt the dispatch for sometime)

//create store and then pass root reducer into it. middleware is used to hold thunk and thunk is the function to dispatch async action creators
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  // provider below binds react to redux
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
