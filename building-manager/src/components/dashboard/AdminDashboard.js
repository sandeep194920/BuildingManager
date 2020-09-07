import React from "react";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";
import AdminRegisterUser from "../auth/AdminRegisterUser";
import { useHistory } from "react-router";

const AdminDashboard = (props) => {
  const { onLogoutUser, firebaseProp, authProp } = props;
  const history = useHistory();
  const logoutHandler = () => {
    onLogoutUser(history);
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
      <br></br>
      <p style={{ color: "red" }}>
        {authProp.authError !== null && authProp.authError}
      </p>
      <br></br>
      <AdminRegisterUser />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    firebaseProp: state.firebase,
    authProp: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutUser: (history) => dispatch(logout(history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
