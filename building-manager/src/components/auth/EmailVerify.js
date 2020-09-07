import React from "react";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";
import { useHistory } from "react-router";

function EmailVerfiy(props) {
  const { firebaseProp, onLogoutUser } = props;
  const history = useHistory();

  const logoutHandler = () => {
    // history.push("/");
    onLogoutUser(history);
  };
  return (
    <div>
      The email is not verified. Kindly click on the verification link sent to
      your email.
      <br></br>
      <br></br>
      {firebaseProp.auth.uid && (
        <button type="button" onClick={logoutHandler}>
          Logout
        </button>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    firebaseProp: state.firebase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutUser: (history) => dispatch(logout(history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailVerfiy);
