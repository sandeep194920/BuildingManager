import firebase from "firebase/app"; // importing base features from firebase. -   import firebase from 'firebase' imports everything from fb which we might not need
import "firebase/firestore"; // importing firestore database
import "firebase/auth"; // importing firebase auth library
import "firebase/functions"; // importing cloud functions
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB9N8ZArG1DbyiuXgGa70KxJ6CK-AQegR4",
  authDomain: "building-manager-f953d.firebaseapp.com",
  databaseURL: "https://building-manager-f953d.firebaseio.com",
  projectId: "building-manager-f953d",
  storageBucket: "building-manager-f953d.appspot.com",
  messagingSenderId: "1084110227353",
  appId: "1:1084110227353:web:a34238d3adee7f9376b508",
  measurementId: "G-TSNDH9Z4HL",
};

// const firebaseFunctions = firebase.functions();
// export { firebaseFunctions };
// export const auth = firebase.auth();

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
