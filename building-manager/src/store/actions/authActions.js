// user registration -> Comes from Register.js
export const register = (registrationParams) => {
  console.log("Entering register() in authAction.js.....");
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    console.log("The user email is " + registrationParams.email);
    console.log("The pass is " + registrationParams.password);

    // before the user gets registered, we need to check if this user exists in unregistered users collection.
    // If exists, then we need to get the email and his unit number and then pass the unit number below so that he gets registered to the right unit
    let unitNo = null;
    let email = null;
    let tenantType = null;
    let docId = null; // this unregisteredUser document is searched using this docId to remove the user from unregisteredUsers collection after registration

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
          tenantType = doc.data().type;
          docId = doc.id; // this is used to remove the user from unregisteredUsers collection after registration
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
          tenantType = -1;
          console.log(
            "No users found with this email in unregisteredUsers collection, hence continuing to register without the unit number"
          );
        }
      })
      .then(function () {
        // user registration process
        console.log("User registering now...");
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
              type: tenantType,
            });
            // after successfully registering the user, check if his tenantType is leasee/occupant. If so then assign him the role of leasee/occupant using cloud functions
          })
          .then(function () {
            // if tenant type is either leasee or occupant
            console.log(
              `The email is ${email} and the tenantType is ${tenantType}`
            );
            // if tenant type is not -1 means that if the tenant is already present in unregisteredUsers collection and would be either leasee or occupant
            if (tenantType !== -1) {
              console.log(`Assigning ${tenantType} role to ${email}`);
              // calling cloud function to assign tenant role
              // makeTenant(email,tenantType);   ---> this simply doesn't work because we need to dispatch the async action and it can't be called like a normal function, hence we dispatch it like below
              dispatch(makeTenant(email, tenantType));
            } else {
              console.log(
                `No role is assigned to the ${registrationParams.email}`
              );
            }
          })
          .catch((err) => {
            dispatch({
              type: "REGISTRATION_FAIL",
              registeredUser: registrationParams.email,
            });
            console.log(err);
          });
      })
      .then(function () {
        // remove the user from unregisteredUsers list if it exists
        // if unitNo is not -1 then the unregistered users list exists.
        // Also, docId can be checked if it exists in unregisteredUsers list, but lets go with unitNo which doesn't have to search the db
        if (docId) {
          console.log(`unregisteredUser ${docId} exists so removing it ...`);
          firestore
            .collection("unregisteredUsers")
            .doc(docId)
            .delete()
            .then(function () {
              console.log(
                `Removed the registered user ${email} from unregistered users collection`
              );
            })
            .catch((error) =>
              console.log(`Error removing the unregistered user ${error}`)
            );
        } else {
          console.log(
            `unregisteredUser doesn't exists so external user was registered`
          );
        }
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      })
      .then(function () {
        console.log("Exitting register() in authAction.js.....");
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

// This addTenantRole() is used to make an email the leasee/occupant using cloud functions
// called in register() in authActions.js (in the same file)
export const makeTenant = (tenantEmail, tenantType) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log("The email whome we make tenant is " + tenantEmail);
    const firebase = getFirebase();

    // calling cloud function here
    const addTenantRole = firebase.functions().httpsCallable("addTenantRole");

    addTenantRole({
      email: tenantEmail,
      tenantRole: tenantType,
    }).then((result) => console.log(result));
  };
};
