import React, { useState } from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";

const Dashboard = (props) => {
  const { makeUserAsAdmin, makeUserAsSuperUser, onLogoutUser } = props;
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
        <br></br>
        <br></br>
        <input
          type="submit"
          onClick={makeSuperUserHandler}
          value="Make Super User"
        />
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
    makeUserAsSuperUser: (email) => dispatch(makeSuperUser(email)),
    onLogoutUser: () => dispatch(logout()),
  };
};

export default connect(null, mapDispatchToProps)(Dashboard);
