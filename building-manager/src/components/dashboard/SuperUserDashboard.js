import React, { useState } from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";
import AdminRegisterUser from "../auth/AdminRegisterUser";

const SuperUserDashboard = (props) => {
  const {
    makeUserAsAdmin,
    makeUserAsSuperUser,
    onLogoutUser,
    firebaseProp,
  } = props;

  const [email, setEmail] = useState(null);
  const makeAdminHandler = (e) => {
    e.preventDefault();
    console.log("The email is " + email);
    makeUserAsAdmin(email);
  };
  const makeSuperUserHandler = (e) => {
    e.preventDefault();
    console.log("The email is " + email);
    makeUserAsSuperUser(email);
  };

  const logoutHandler = () => {
    onLogoutUser();
  };

  return (
    <div>
      <h1> This is Super User Dashboard</h1>
      <br />
      <p>You can make admin and super user here</p>

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
        <br></br>
        <br></br>
        <input
          type="submit"
          onClick={makeSuperUserHandler}
          value="Make Super User"
        />
      </form>
      <br></br>
      <a href="/">Home</a>
      <br></br>
      <br></br>
      <br />
      <br />

      {firebaseProp.auth.uid ? (
        <button type="button" onClick={logoutHandler}>
          Logout
        </button>
      ) : (
        <div>
          <br />
          <br />
          <a href="/login">Login</a>
        </div>
      )}
      <br></br>
      <h2>Register a user here</h2>
      <AdminRegisterUser />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    firebaseProp: state.firebase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    makeUserAsAdmin: (email) => dispatch(makeAdmin(email)),
    makeUserAsSuperUser: (email) => dispatch(makeSuperUser(email)),
    onLogoutUser: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SuperUserDashboard);
