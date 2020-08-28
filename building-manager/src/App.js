import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
