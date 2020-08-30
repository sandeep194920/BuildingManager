import React from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";

const Dashboard = (props) => {
  const { onLogoutUser, firebaseProp } = props;

  const logoutHandler = () => {
    onLogoutUser();
  };

  return (
    <React.Fragment>
      <div>Welcome to the Building manager app</div>
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
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
