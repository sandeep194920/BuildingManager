import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { makeAdmin, makeSuperUser } from "../../store/actions/authActions";
import { logout } from "../../store/actions/authActions";
import { useHistory } from "react-router";
import { useFirestoreConnect } from "react-redux-firebase"; // this is a hoc which needs to be used to get the firestore reducer data to say which collection's data we need to get from firestore
// import { firestoreConnect } from "react-redux-firebase"; // this is a hoc which needs to be used to get the firestore reducer data to say which collection's data we need to get from firestore
//import { compose } from "redux"; // to combine multiple hocs

const TenantDashboard = (props) => {
  const history = useHistory();
  const {
    onLogoutUser,
    firebaseProp,
    firestoreUsers,
    firestoreNotifications,
  } = props;
  const [loggedInUser, setLoggedInUser] = useState(null); //this will be updated in the useEffect below
  const [unitNoOfUser, setUnitNoOfUser] = useState("0"); //this will be updated in the useEffect below
  const [notifications, setNotifications] = useState([]);

  // useEffect to get the logged in user and also his unitNumber
  useEffect(() => {
    if (firebaseProp.auth.uid) {
      console.log("The user logged in is " + firebaseProp.auth.uid);
      setLoggedInUser(firebaseProp.auth.uid);
      // get the unit number of the user who has currently logged in and pass it to the doc inside useFirestoreConnect
      // 'if' loop is used because otherwise we get null error before the firestoreUsers loads, so we first check if it exists. It takes time to load and then displays it
      if (firestoreUsers && loggedInUser) {
        setUnitNoOfUser(firestoreUsers[loggedInUser]["unitNo"]);
        console.log(firestoreUsers[loggedInUser]["unitNo"]);
      }
      if (firestoreNotifications) {
        setNotifications(firestoreNotifications);
        console.log(firestoreNotifications);
      }
    }
  }, [
    firebaseProp.auth.uid,
    firestoreUsers,
    firestoreNotifications,
    loggedInUser,
  ]);

  // Initally I used firestoreConnect but now using useFirestoreConnect. The reason is that, in firestoreConnect, I couldn't use the variable which can be assigned to doc, but in useFirestoreConnect I can assign the variable. Hence commented the below code and doesnt need compose anymore.

  useFirestoreConnect([
    // this is the process to get subcollections. We are getting units/id/notifications. notifications is the subcollection. storeAs is important else we get error
    // if we just need units without subcollection then we can omit doc, subcollections and storeAs
    {
      collection: "users",
      doc: loggedInUser,
      // where: ["unitNo", "==", 1],
    },
    {
      collection: "units",
      doc: unitNoOfUser, // this is the unitNo where the loggedIn user currently lives
      subcollections: [{ collection: "notifications" }],
      storeAs: "notifications",
    },
  ]);

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
      <br />
      <br />
      <hr />
      <h2>Notifications</h2>
      {/* if notifications exists then we loop through them*/}
      {notifications && (
        <div>
          {notifications.map((notification) => {
            return (
              <React.Fragment key={notification.id}>
                <h3 style={{ color: "blue" }}>{notification.title}</h3>
                <h4>{notification.message}</h4>
                <br />
              </React.Fragment>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  console.log(state.firestore);
  return {
    firebaseProp: state.firebase,
    firestoreNotifications: state.firestore.ordered.notifications,
    firestoreUsers: state.firestore.data.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    makeUserAsAdmin: (email) => dispatch(makeAdmin(email)),
    makeUserAsSuperUser: (email) => dispatch(makeSuperUser(email)),
    onLogoutUser: (history) => dispatch(logout(history)),
  };
};
// commenting the below code as we are now using useFirestoreConnect

// we were already using connect higher order component and then we wanted to use firestoreConnect which is another hoc. To use multiple hocs we use compose function
// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   // which collection's data we need to get from firestore is mentioned in firestoreConnect. It takes an array that can contain series of objects
//   // In short, the firestoreConnect says -> when this component is active, I would like to listen to these collections mentioned below
//   // This will now induce the firestore reducer to sync the store state  with the below mentioned collection/s with the firestore
//   // The firestore reducer which is in root reducer will sync up with below collections here so that any crud operations occur in db will be reflected
//   firestoreConnect([
//     // this is the process to get subcollections. We are getting units/id/notifications. notifications is the subcollection. storeAs is important else we get error
//     // if we just need units without subcollection then we can omit doc, subcollections and storeAs
//     {
//       collection: "units",
//       doc: "1",
//       subcollections: [{ collection: "notifications" }],
//       storeAs: "notifications",
//     },
//   ])
// )(TenantDashboard);

export default connect(mapStateToProps, mapDispatchToProps)(TenantDashboard);
