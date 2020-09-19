import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import TenantDashboard from "./components/dashboard/TenantDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SuperUserDashboard from "./components/dashboard/SuperUserDashboard";
import { connect } from "react-redux";
import firebase from "firebase/app";
import EmailVerfiy from "./components/auth/EmailVerify";
import Register from "./components/auth/Register";

function App(props) {
  // const { firebaseProp } = props; // this is given by firebaseReducer coming from mapStateToProps. We might use this to check the uid or something related to the user. Alternatively, we could use firebase which we imported
  const [role, setRole] = React.useState("user");
  const [isEmailVerified, setEmailVerified] = React.useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(true);
  let routes = null;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      setIsUserLoggedIn(true);
      if (user.emailVerified) {
        setEmailVerified(true);
      } else {
        setEmailVerified(false);
        return;
      }
      console.log("User has logged in");
      console.log(user);
      user
        .getIdTokenResult()
        .then((idTokenResult) => {
          // Confirm the user is an Admin / Normal User / Super User / Leasee / Occupant.
          if (idTokenResult.claims.admin) {
            console.log("claim present admin");
            setRole("admin");
            setIsUserLoggedIn(true);
            setEmailVerified(true);
          } else if (idTokenResult.claims.superUser) {
            console.log("claim present super user");
            setRole("superUser");
            setIsUserLoggedIn(true);
            setEmailVerified(true);
          } else if (idTokenResult.claims.leasee) {
            console.log("claim present leasee");
            setRole("leasee");
            setIsUserLoggedIn(true);
            setEmailVerified(true);
          } else if (idTokenResult.claims.occupant) {
            console.log("claim present occupant");
            setRole("occupant");
            setIsUserLoggedIn(true);
            setEmailVerified(true);
          } else {
            console.log("No claims present, so normal user");
            setRole("user");
            setIsUserLoggedIn(true);
            setEmailVerified(true);
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

  if (isUserLoggedIn && isEmailVerified) {
    switch (role) {
      case "superUser":
        routes = (
          <Switch>
            <Route path="/superuser" exact component={SuperUserDashboard} />
            <Route
              path="/test"
              exact
              render={() => <div>Test super page</div>}
            />
            <Redirect to="/superuser" />
          </Switch>
        );
        return <BrowserRouter>{routes}</BrowserRouter>;
      case "admin":
        console.log("REACHED ADMIN SWITCH");
        routes = (
          <Switch>
            <Route path="/admin" exact component={AdminDashboard} />
            <Route path="/tests" exact component={AdminDashboard} />
            <Route path="/testss" exact component={AdminDashboard} />
            <Route path="/test" exact render={() => <div>Test page</div>} />
            <Redirect to="/admin" />
          </Switch>
        );
        return <BrowserRouter>{routes}</BrowserRouter>;

      case "leasee":
        console.log("THE LOGGER IS LEASEE");
        routes = (
          <Switch>
            <Route path="/leasee" exact component={TenantDashboard} />
            <Redirect to="/leasee" />
          </Switch>
        );
        return <BrowserRouter>{routes}</BrowserRouter>;

      case "occupant":
        routes = (
          <Switch>
            <Route path="/occupant" exact component={Dashboard} />
            <Route path="/login" exact component={Login} />
          </Switch>
        );
        return <BrowserRouter>{routes}</BrowserRouter>;

      // normal user
      default:
        routes = (
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/login" exact component={Login} />
            <Route path="/test" exact render={() => <div>Test page</div>} />
            {/* <Redirect to="/" /> */}
          </Switch>
        );
        return <BrowserRouter>{routes}</BrowserRouter>;
    }
  } else if (isUserLoggedIn && !isEmailVerified) {
    // loggedin but not verified
    routes = (
      <Switch>
        <Route path="/verify-email" exact component={EmailVerfiy} />
        <Redirect to="/verify-email" />
      </Switch>
    );
    return <BrowserRouter>{routes}</BrowserRouter>;
  } else {
    // not loggedin
    routes = (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/no" exact render={() => <div>No one logged in</div>} />
        <Route path="/tests" exact render={() => <div>Test page</div>} />
        <Redirect to="/" />
      </Switch>
    );
    return <BrowserRouter>{routes}</BrowserRouter>;
  }
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

// functionality of user registration:

// 1. Admin fills the form by giving a user's email and his unitNo number (This is done for the users who are tenants - either leasee or occupant).
//    This should create a user in unregisteredUsers collection.

// 2. Now the user registers by giving email, pass, phone. Now during registration, all users are called in unregisteredUsers collection
//    and checked for this email. If it exists then the unitNo and leasee/occupant info is taken from that so this user can be registered
//    as tenant user and assigned a role of tenant-user. After registration, this user (if was present on unregisteredUsers collection),
//    is removed from unregisteredUsers collection.

// 3. What is the advantage of step 2 type registration ? a) The unit number is protected. Tenant user role is assigned and can
//    differentiate the non-tenant user.

// 4. Let's say the user registers by giving all the details of email, pass and phone. Now during registration, all the users
//    are called in unregisteredUsers collection and checked for this email which doesnt exist. Then this user is not our tenant and hence
//    can be considered as non-tenant user and no need of any role though. No role means non-tenant user. Subject to change in future if needed.

// 5. How it happens if the non-tenant user should become a tenant-user ?
//    In this case, the user must be manually assigned the tenant user's role and then assign the unit number manually to this user.
//    The admin dashboard will have a way to check if the user is tenant-user or non-tenant user. non-tenant user is not assinged
//    any role and the tenant user is assigned a tenant user role.
