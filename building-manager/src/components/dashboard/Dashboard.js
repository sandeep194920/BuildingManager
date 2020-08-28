import React, { useState } from "react";
import { connect } from "react-redux";
import { makeAdmin } from "../../store/actions/authActions";
// import { auth } from "../../configs/fbConfig";
import { logout } from "../../store/actions/authActions";

// import * as firebase from "firebase";

const Dashboard = (props) => {
  const { makeUserAsAdmin, onLogoutUser } = props;
  const [email, setEmail] = useState(null);
  const makeAdminHandler = (e) => {
    e.preventDefault();
    console.log("The email is " + email);
    makeUserAsAdmin(email);
  };
  const logoutHandler = () => {
    onLogoutUser();
  };
  // firebase.auth().onAuthStateChanged(function (user) {
  //   if (user) {
  //     // User is signed in.
  //     console.log("The logged user is  -> " + user.uid);
  //   } else {
  //     // No user is signed in.
  //   }
  // });

  return (
    <React.Fragment>
      <div>Welcome to the Building manager app</div>
      <br />
      <br />
      <form>
        <input
          type="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <br />
        <input type="submit" onClick={makeAdminHandler} value="Make Admin" />
      </form>
      <br />
      <br />
      <button type="button" onClick={logoutHandler}>
        Logout
      </button>
      <br />
      <br />
      <a href="/login">Login</a>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    makeUserAsAdmin: (email) => dispatch(makeAdmin(email)),
    onLogoutUser: () => dispatch(logout()),
  };
};

export default connect(null, mapDispatchToProps)(Dashboard);
