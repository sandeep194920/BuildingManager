const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

//when we call addAdminRole from front-end, the call back function written inside this is going to fire
exports.addAdminRole = functions.https.onCall((data, context) => {
  // data param include any data we send when we call from front-end

  // get the user and add custom claim (admin) to the user
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`,
      };
    })
    .catch((err) => console.log("There is an error here " + err));
});

//when we call addSuperUserRole from front-end, the call back function written inside this is going to fire
exports.addSuperUserRole = functions.https.onCall((data, context) => {
  // data param include any data we send when we call from front-end

  // get the user and add custom claim (superUser) to the user
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        superUser: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made super user`,
      };
    })
    .catch((err) => console.log("There is an error here " + err));
});
