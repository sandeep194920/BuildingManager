import React, { useState } from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";

const SuperUserDashboard = (props) => {
  const { makeUserAsAdmin, makeUserAsSuperUser } = props;
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
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    makeUserAsAdmin: (email) => dispatch(makeAdmin(email)),
    makeUserAsSuperUser: (email) => dispatch(makeSuperUser(email)),
    onLogoutUser: () => dispatch(logout()),
  };
};

export default connect(null, mapDispatchToProps)(SuperUserDashboard);
