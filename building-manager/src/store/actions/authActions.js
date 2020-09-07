// register a user by admin -> Comes from AdminRegisterUser.js
export const registerUserByAdmin = (registrationParams) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    console.log("The username " + registrationParams.email);
    console.log("The pass is " + registrationParams.password);

    firebase
      .auth()
      .createUserWithEmailAndPassword(
        registrationParams.email,
        registrationParams.password
      ) // change this to -> click on link sent to email and create password later
      .then((response) => {
        dispatch({
          type: "REGISTRATION_SUCCESS",
          registerdUser: registrationParams.email,
        });

        // const actionCodeSettings = {
        // url: "localhost:3000",
        // "https://www.example.com/?email=" +
        // firebase.auth().currentUser.email,
        // iOS: {
        //   bundleId: 'com.example.ios'
        // },
        // android: {
        //   packageName: 'com.example.android',
        //   installApp: true,
        //   minimumVersion: '12'
        // },
        // handleCodeInApp: true,
        // // When multiple custom dynamic link domains are defined, specify which
        // // one to use.
        // dynamicLinkDomain: "example.page.link"
        // };

        // send verification email
        var user = firebase.auth().currentUser;
        user
          .sendEmailVerification()
          .then(function () {
            // Email sent.
            console.log("Email sent");
          })
          .catch(function (error) {
            // An error happened.
            console.log("Due to error, email was not sent " + error.message);
          });

        alert(`The user ${registrationParams.email} registered successfully`);
        // add this user who just now registered into users collection and then assign his unit number. If users collection doesnt exist, then it will be created using below code
        firestore.collection("users").doc(response.user.uid).set({
          unitNo: registrationParams.unitNo,
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
