import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SuperUserDashboard from "./components/dashboard/SuperUserDashboard";
import { connect } from "react-redux";
import firebase from "firebase/app";

function App(props) {
  //const { firebaseProp } = props; // this is given by firebaseReducer coming from mapStateToProps. We might use this to check the uid or something related to the user. Alternatively, we could use firebase which we imported

  const [role, setRole] = React.useState("user");

  let routes = null;
  if (role === "user") {
    console.log("The logged in user is Normal User");
    routes = (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        {/* Default route to home if none of the above routes are matched */}
        {/* <Route path="/" component={Dashboard} /> */}
        <Redirect exact from="/" to="/" />
      </Switch>
    );
  } else if (role === "admin") {
    console.log("The logged in user is Admin User");

    routes = (
      <Switch>
        {/* <Route path="/" exact component={Dashboard} /> */}
        <Route path="/admin" exact component={AdminDashboard} />
        <Route path="/login" exact component={Login} />
        {/* Default route to home if none of the above routes are matched */}
        {/* <Route path="/admin" component={AdminDashboard} /> */}
        <Redirect exact from="/" to="/admin" />
      </Switch>
    );
  } else if (role === "superUser") {
    console.log("The logged in user is Super User");

    routes = (
      <Switch>
        {/* <Route path="/" exact component={Dashboard} /> */}
        <Route path="/login" exact component={Login} />
        <Route path="/admin" exact component={AdminDashboard} />
        <Route path="/superuser" exact component={SuperUserDashboard} />
        {/* Default route to home if none of the above routes are matched */}
        {/* <Route path="/superuser" component={SuperUserDashboard} /> */}
        <Redirect exact from="/" to="/superuser" />
      </Switch>
    );
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log("User has logged in");
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          // Confirm the user is an Admin / Normal User / Super User.

          if (idTokenResult.claims.admin) {
            console.log("claim present admin");
            setRole("admin");
          } else if (idTokenResult.claims.superUser) {
            setRole("superUser");
          } else {
            console.log("No claims present, so normal user");
            setRole("user");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // User not logged in. Or he just logged out
      console.log("User has not logged in");
    }
  });

  return (
    <BrowserRouter>
      {/* gets the routes according to the role of admin / user / superuser */}
      <Switch>{routes}</Switch>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    firebaseProp: state.firebase,
  };
};

export default connect(mapStateToProps)(App);

// roles :

// 1. Routes for logged out user
//   /  dashboard -> contains login links -> When logged in, takes the user to respective dashboard page based on his role
//

// 2. Routes for admin user
//   /  admin dashboard  -> Contains logout link -> When logged out, gets back to 1. logged out dashboard

// 3. Routes for super user
//  /superuser-login -> Can login as super user and then takes to /superuser -> super user dashboard
//  /superuser contains form to make an email a super user as well as admin. It also contains a logout btn that helps to logout

// 4. Routes for tenant user
// /  dashboard -> Contains logout link -> When logged out, gets back to 1. logged out dashboard which is same as this dashboard
// /tenant-login -> is for tenant login. It contains placeholder for username , pass and apt number.
