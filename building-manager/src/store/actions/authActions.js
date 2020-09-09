// user registration -> Comes from Register.js
export const register = (registrationParams) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    console.log("The username " + registrationParams.email);
    console.log("The pass is " + registrationParams.password);

    // before the user gets registered, we need to check if this user exists in unregistered users collection.
    // If exists, then we need to get the email and his unit number and then pass the unit number below so that he gets registered to the right unit
    let unitNo = null;
    let email = null;

    // query for a user in unregisteredUsers collection. If exists, then it means he is a tenant/occupant and hence should have a unitNo and also we should assign him the tenant role (TODO).
    // we get the unitNo from unregisteredUsers collection, and if the user isn't present there then the unitNo will be null, hence we can
    // consider him as an outside user
    firestore
      .collection("unregisteredUsers")
      .where("email", "==", registrationParams.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          email = doc.data().email;
          unitNo = doc.data().unitNo;
        });
      })
      .then(function () {
        console.log(`The unit num is ${unitNo} and the email is ${email}`);
        if (unitNo) {
          console.log(
            "We found this user and exists in unregisteredUsers collection. His email is " +
              email +
              " and the unit is " +
              unitNo
          );
        } else {
          unitNo = -1;
          console.log(
            "No users found with this email in unregisteredUsers collection, hence continuing to register without the unit number"
          );
        }
        // user registration process
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            registrationParams.email, // this is not 'email' variable because it can be null if user is not in collection of unregisteredUsers, hence it is registrationParams.email
            registrationParams.password
          )
          .then((response) => {
            dispatch({
              type: "REGISTRATION_SUCCESS",
              registerdUser: registrationParams.email,
            });

            // send verification email
            var user = firebase.auth().currentUser;
            user
              .sendEmailVerification()
              .then(function () {
                // Email sent.
                console.log("Email sent");
              })
              .catch(function (error) {
                console.log(
                  "Due to error, email was not sent " + error.message
                );
              });

            alert(
              `The user ${registrationParams.email} registered successfully. Please verify by clicking the link sent to your email and then refresh this page`
            );
            // add this user who just now registered into users collection and then assign his unit number (if this user is not in unregisteredUsers then the unitNo is -1).
            // if users collection doesnt exist, then it will be created using below code
            firestore.collection("users").doc(response.user.uid).set({
              unitNo: unitNo,
              phoneNo: registrationParams.phoneNo,
              firstName: registrationParams.firstName,
              lastName: registrationParams.lastName,
            });
          })
          .catch((err) => {
            dispatch({
              type: "REGISTRATION_FAIL",
              registeredUser: registrationParams.email,
            });
            console.log(err);
          });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };
};

// add user by admin to unregisteredUsers collection (genrally after signing the lease) and before the user registers to the app
// called in -> AdminAddUser.js which is called in AdminDashboard.js
export const addUserByAdmin = (tenantsInfo) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // const firebase = getFirebase();
    const firestore = getFirestore();
    console.log("The user's email is " + tenantsInfo.email);
    console.log("The user's apt number is " + tenantsInfo.unitNo);

    // add this user to unregisteredUsers collection.
    firestore
      .collection("unregisteredUsers")
      .doc()
      .set({
        email: tenantsInfo.email,
        unitNo: tenantsInfo.unitNo,
        type: tenantsInfo.selectedOption,
      }) // TODO : Dispatch the below action later
      .then(console.log("Added new user to unregistered list successfully."))
      .catch((err) => console.log(err));
  };
};

// login
export const login = (username, password) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    console.log("The username " + username);
    console.log("The pass is " + password);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((response) => {
        dispatch({ type: "LOGIN_SUCCESS" });
        console.log(response.user.uid);
      })
      .catch((err) => {
        dispatch({ type: "LOGIN_FAIL" });
        console.log(err);
      });
  };
};
// logout
export const logout = (history) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then((resp) => {
        console.log("Logged out");
        history.push("/login");
      });
  };
};

// add admin cloud functions. This makeAdmin() is used to make an email the admin using cloud functions
// called in SuperUser.js
export const makeAdmin = (adminEmail) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log("The email is " + adminEmail);
    const firebase = getFirebase();

    // calling cloud function here
    const addAdminRole = firebase.functions().httpsCallable("addAdminRole");

    addAdminRole({ email: adminEmail }).then((result) => console.log(result));
  };
};

// This addSuperUserRole() is used to make an email the super user using cloud functions
// called in SuperUser.js
export const makeSuperUser = (superUserEmail) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log("The email is " + superUserEmail);
    const firebase = getFirebase();

    // calling cloud function here
    const addSuperUserRole = firebase
      .functions()
      .httpsCallable("addSuperUserRole");

    addSuperUserRole({ email: superUserEmail }).then((result) =>
      console.log(result)
    );
  };
};
