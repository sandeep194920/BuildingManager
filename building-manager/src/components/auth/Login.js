import React, { useState } from "react";
import { connect } from "react-redux";
import { login } from "../../store/actions/authActions";
import firebase from "firebase/app";
import { useHistory } from "react-router";

const Login = (props) => {
  const { onLoginUser } = props;
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const history = useHistory();

  const loginHandler = (e) => {
    e.preventDefault(); // prevents page refresh
    console.log("REached login handler");
    onLoginUser(email, pass);
  };

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      console.log("Header logged in if -> " + user.uid);
      user.getIdTokenResult().then((idTokenResult) => {
        // console.log(idTokenResult.claims);
        if (idTokenResult.claims.admin) {
          history.push("/");
        } else if (idTokenResult.claims.superUser) {
          history.push("/");
        } else {
          history.push("/");
        }
      });

      // setUserId(user.uid);
      // setUserName(user.displayName);
    } else {
      // No user is signed in.
      // console.log("Header else -> ");
      // setUserId(null);
      // setUserName(null);
    }
  });

  return (
    <div>
      <form>
        <br></br>
        <br></br>
        <label>Enter username</label>
        <br></br>

        <input
          type="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <br></br>

        <label onClick={loginHandler}>Enter password</label>
        <br></br>
        <input
          type="password"
          defaultValue={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <br></br>
        <br></br>
        <input onClick={loginHandler} type="submit" value="Login" />
      </form>
      <br></br>
      <br></br>
      <a href="/">Home</a>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginUser: (email, password, history) =>
      dispatch(login(email, password, history)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
