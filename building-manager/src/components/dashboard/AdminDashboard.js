import React from "react";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";

const AdminDashboard = (props) => {
  const { onLogoutUser, firebaseProp } = props;

  const logoutHandler = () => {
    onLogoutUser();
  };

  return (
    <div>
      <h1> This is admin Admin Dashboard</h1>
      <p>Let's add admin stuff here</p>
      <br></br>
      {firebaseProp.auth.uid ? (
        <button type="button" onClick={logoutHandler}>
          Logout
        </button>
      ) : (
        <div>
          <br></br>
          <a href="/">Home</a>
          <br></br>
          <br></br>
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
    onLogoutUser: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
