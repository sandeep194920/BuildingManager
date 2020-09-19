import React from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";
import { useHistory } from "react-router";

const TenantDashboard = (props) => {
  const { onLogoutUser } = props;
  const history = useHistory();
  const logoutHandler = () => {
    onLogoutUser(history);
  };

  return (
    <React.Fragment>
      <div>Welcome to the Tenant Dashboard </div>
      <br></br>
      <br></br>
      <button type="button" onClick={logoutHandler}>
        Logout
      </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TenantDashboard);
