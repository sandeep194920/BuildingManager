import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";
import { notifyUnit } from "../../store/actions/adminFunctions";
import AdminAddUser from "../auth/AdminAddUser";
import { useHistory } from "react-router";
import { useFirestoreConnect } from "react-redux-firebase"; // this is a hoc which needs to be used to get the firestore reducer data to say which collection's data we need to get from firestore
import moment from "moment";

const AdminDashboard = (props) => {
  const {
    onLogoutUser,
    firebaseProp,
    authProp,
    onNotifyUnit,
    firestoreAdminNotifications,
  } = props;
  const [unitNo, setUnitNo] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  useFirestoreConnect([
    {
      collection: "adminNotifications",
    },
  ]);

  // logout handler
  const logoutHandler = () => {
    onLogoutUser(history);
  };

  // send notification to unit
  const notifyUnitHandler = (e) => {
    e.preventDefault();
    onNotifyUnit(unitNo, title, message);
    setUnitNo("");
    setTitle("");
    setMessage("");
  };

  return (
    <div>
      <h1> This is admin Admin Dashboard</h1>
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
      <hr />
      <AdminAddUser />
      {/* send notification to a unit */}
      <hr />
      <h2>Send notification to the tenants in the unit</h2>
      <form onSubmit={notifyUnitHandler}>
        <label>Unit number</label>
        <br />
        <input
          type="text"
          value={unitNo}
          onChange={(e) => setUnitNo(e.target.value)}
        />
        <br></br>
        <br></br>
        <label>Title</label>
        <br />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br></br>
        <br></br>
        <label>Message</label>
        <br />

        <input
          type="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <br />
        <input type="submit" value="Notify tenants" />
      </form>
      <hr />
      <h2>Notifications</h2>
      <div>
        {firestoreAdminNotifications &&
          firestoreAdminNotifications.map((notification) => {
            return (
              <React.Fragment key={notification.id}>
                <br />
                {`${notification.type} - ${notification.content}  -  ${moment(
                  notification.time.toDate()
                ).fromNow()}`}
                <br />
              </React.Fragment>
            );
          })}
      </div>

      <br />
      <br />
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state.firestore);
  return {
    firebaseProp: state.firebase,
    authProp: state.auth,
    firestoreAdminNotifications: state.firestore.ordered.adminNotifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutUser: (history) => dispatch(logout(history)),
    onNotifyUnit: (unitNo, title, message) =>
      dispatch(notifyUnit(unitNo, title, message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
