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

export const logout = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then((resp) => console.log("Logged out"));
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
