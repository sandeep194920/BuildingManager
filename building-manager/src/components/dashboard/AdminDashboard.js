import React, { useState } from "react";
import { connect } from "react-redux";
import { logout } from "../../store/actions/authActions";
import { notifyUnit, notifyAll } from "../../store/actions/adminFunctions";
import AdminAddUser from "../auth/AdminAddUser";
import { useHistory } from "react-router";
import { useFirestoreConnect } from "react-redux-firebase"; // this is a hoc which needs to be used to get the firestore reducer data to say which collection's data we need to get from firestore
import moment from "moment";

const AdminDashboard = (props) => {
  const {
    onLogoutUser,
    firebaseProp, // used to check if user is logged in or not to show the logout btn
    authProp,
    onNotifyUnit,
    firestoreAdminNotifications,
    onNotifyAll,
  } = props;
  // consts below used for notifications
  // unitNo is used in notifyUnitHandler to notify a single unit along with title and message. tenantType, title and message are used in notifyAllHandler
  const [unitNo, setUnitNo] = useState(0);
  const [title, setTitle] = useState(""); // for notifying single unit
  const [message, setMessage] = useState(""); // for notifying single unit
  const [tenantType, setTenantType] = useState("both"); // this can be 'leasee' or 'occupant' or 'both' -> Selecting them will noitify the admins message to these users-> leasee or occupant or both

  //notify all units
  const [notifyAllTitle, setNotifyAllTitle] = useState("");
  const [notifyAllMessage, setNotifyAllMessage] = useState("");

  // used to redirect after logout. history is passed to the logout action.
  const history = useHistory();

  // used to get the collection from firestore which is in sync with firestoreAdminNotifications props. useFirestoreConnect tells which collection/s of firestore must be synced up with firestore prop for this particular component.
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
    if (unitNo > 0) {
      e.preventDefault();
      onNotifyUnit(unitNo, title, message);
      setUnitNo("");
      setTitle("");
      setMessage("");
    } else {
      alert("Invalid Unit entered");
    }
  };

  // send notification to tenants (leasees or occupants or both)
  const notifyAllUnitsHandler = (e) => {
    e.preventDefault();
    onNotifyAll(tenantType, notifyAllTitle, notifyAllMessage);
    setNotifyAllTitle("");
    setNotifyAllMessage("");
    setTenantType("both");
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
          <br />
          <br />
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
          required
          value={unitNo}
          onChange={(e) => setUnitNo(e.target.value)}
        />
        <br></br>
        <br></br>
        <label>Title</label>
        <br />

        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br></br>
        <br></br>
        <label>Message</label>
        <br />

        <input
          type="textarea"
          required
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
      <hr />
      {/* send notification to a all -> leasee or occupant or both in all units */}
      <div>
        <h2>Notify tenants</h2>
        <form onSubmit={notifyAllUnitsHandler}>
          <br></br>
          <label>Title</label>
          <br />

          <input
            type="text"
            value={notifyAllTitle}
            required
            onChange={(e) => setNotifyAllTitle(e.target.value)}
          />
          <br></br>
          <br></br>
          <label>Message</label>
          <br />

          <input
            type="textarea"
            required
            value={notifyAllMessage}
            onChange={(e) => setNotifyAllMessage(e.target.value)}
          />
          <br />
          <br />

          <div className="radio">
            <label>
              <input
                type="radio"
                value="leasee"
                checked={tenantType === "leasee"}
                onChange={() => setTenantType("leasee")}
              />
              Notify all Leasees
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="occupant"
                checked={tenantType === "occupant"}
                onChange={() => setTenantType("occupant")}
              />
              Notify all Occupants
            </label>
          </div>
          <div className="radio">
            <label>
              <input
                type="radio"
                value="occupant"
                checked={tenantType === "both"}
                onChange={() => setTenantType("occupant")}
              />
              Notify all occupants and leasees
            </label>
          </div>

          <br />
          <input type="submit" value="Notify" />
        </form>
      </div>
      <hr />

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
    onNotifyAll: (tenantType, title, message) =>
      dispatch(notifyAll(tenantType, title, message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
