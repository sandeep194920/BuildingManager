import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SuperUserDashboard from "./components/dashboard/SuperUserDashboard";
import { connect } from "react-redux";
import firebase from "firebase/app";
import EmailVerfiy from "./components/auth/EmailVerify";

function App(props) {
  // const { firebaseProp } = props; // this is given by firebaseReducer coming from mapStateToProps. We might use this to check the uid or something related to the user. Alternatively, we could use firebase which we imported

  const [role, setRole] = React.useState(null);
  const [isEmailVerified, setEmailVerified] = React.useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);

  let routes = null;

  // the user is currently logged in and also verified, so he can see all the routes according to his role
  if (isUserLoggedIn && isEmailVerified) {
    console.log("User logged in and also verified. Now he can have access");
    // normal user
    if (role === "user") {
      console.log("The logged in user is Normal User");
      routes = (
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login" exact component={Login} />
          {/* Default route to home if none of the above routes are matched */}
          <Redirect to="/" />
        </Switch>
      );
      // admin user
    } else if (role === "admin") {
      console.log("The logged in user is Admin User");

      routes = (
        <Switch>
          <Route path="/admin" exact component={AdminDashboard} />
          <Route path="/login" exact component={Login} />
          {/* Default route to home if none of the above routes are matched */}
          <Redirect to="/admin" />
        </Switch>
      );
      // super user
    } else if (role === "superUser") {
      console.log("The logged in user is Super User");

      routes = (
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/admin" exact component={AdminDashboard} />
          <Route path="/superuser" exact component={SuperUserDashboard} />
          {/* Default route to home if none of the above routes are matched */}
          <Redirect to="/superuser" />
        </Switch>
      );
      // normal user. This is not necessary but just in case. Can be modified this later to remove this else statement or insert any other default case
    } else {
      routes = (
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login" exact component={Login} />
          <Redirect to="/" />
        </Switch>
      );
    }
    // if user is logged in and email not verified then he can see only the verify-email page that has a verify email message and a logout btn
  } else if (isUserLoggedIn && !isEmailVerified) {
    console.log(
      "User logged in but not verified. First he need to verify and then only access any resource"
    );
    routes = (
      <Switch>
        <Route path="/verify-email" exact component={EmailVerfiy} />
        <Redirect to="/verify-email" />
      </Switch>
    );
    // the user is not logged in here
  } else {
    console.log("The user not logged in at all so no problem");
    routes = (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Redirect to="/" />
      </Switch>
    );
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      setIsUserLoggedIn(true);
      if (user.emailVerified) {
        setEmailVerified(true);
      } else {
        setEmailVerified(false);
      }
      console.log("User has logged in");
      console.log(user);
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
      setIsUserLoggedIn(false);
      setEmailVerified(false);
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
