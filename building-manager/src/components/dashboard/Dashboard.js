import React from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";
import { useHistory } from "react-router";

const Dashboard = (props) => {
  const { onLogoutUser, firebaseProp } = props;
  const history = useHistory();
  const logoutHandler = () => {
    onLogoutUser(history);
  };

  return (
    <React.Fragment>
      <div>Welcome to the Building manager app</div>
      <br></br>
      <br></br>
      {firebaseProp.auth.uid ? (
        <button type="button" onClick={logoutHandler}>
          Logout
        </button>
      ) : (
        <div>
          <br />
          <br />
          <a href="/login">Login</a>
          <br></br>
          <br></br>
          <a href="/register">Register</a>
        </div>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  console.log(state.firebase);
  return {
    firebaseProp: state.firebase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    makeUserAsAdmin: (email) => dispatch(makeAdmin(email)),
    makeUserAsSuperUser: (email) => dispatch(makeSuperUser(email)),
    onLogoutUser: (history) => dispatch(logout(history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
