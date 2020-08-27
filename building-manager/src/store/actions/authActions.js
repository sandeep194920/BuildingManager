// import { getFirebase } from "react-redux-firebase";

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
