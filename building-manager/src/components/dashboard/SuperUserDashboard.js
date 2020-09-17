import React, { useState } from "react";
import { connect } from "react-redux";
import {
  makeAdmin,
  makeSuperUser,
  makeTenant,
} from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";
import { useHistory } from "react-router";

const SuperUserDashboard = (props) => {
  const {
    makeUserAsAdmin,
    makeUserAsSuperUser,
    makeUserAsLeasee,
    makeUserAsOccupant,
    onLogoutUser,
    firebaseProp,
  } = props;
  const history = useHistory();
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

  const makeLeaseeHandler = (e) => {
    e.preventDefault();
    console.log("The email is " + email);
    makeUserAsLeasee(email);
  };

  const makeOccupantHandler = (e) => {
    e.preventDefault();
    console.log("The email is " + email);
    makeUserAsOccupant(email);
  };

  const logoutHandler = () => {
    onLogoutUser(history);
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
        <br></br>

        <br></br>
        <input type="submit" onClick={makeLeaseeHandler} value="Make Leasee" />
        <br></br>
        <br></br>

        <input
          type="submit"
          onClick={makeOccupantHandler}
          value="Make Occupant"
        />
        <br></br>
        <br></br>
      </form>
      <br></br>
      <br></br>
      <br></br>
      <a href="/test">Test</a>

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
    makeUserAsLeasee: (email) => dispatch(makeTenant(email, "leasee")),
    makeUserAsOccupant: (email) => dispatch(makeTenant(email, "occupant")),
    onLogoutUser: (history) => dispatch(logout(history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SuperUserDashboard);
