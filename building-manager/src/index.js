import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore } from "redux";
import rootReducer from "./store/reducers/rootReducer"; // this has all the reducers
import { Provider } from "react-redux"; // this lets the app to have access to redux store. This binds react to redux store

//create store and then pass root reducer into it
const store = createStore(rootReducer);

ReactDOM.render(
  // provider below binds react to redux
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
