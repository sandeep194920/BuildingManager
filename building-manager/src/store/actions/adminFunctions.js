// admin notify unit tenants
export const notifyUnit = (unitNo, title, message) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    console.log(
      `The unit is ${unitNo}, title is ${title} and message is ${message}`
    );
    // get the
    // Add a new notification with a generated id.
    if (unitNo <= -1) {
      console.log("Sorry wrong unit");
      return;
    } else {
      firestore
        .collection("units")
        .doc(unitNo)
        .collection("notifications")
        .add({
          title,
          message,
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  };
};

// get the documents collection whose unitNo is so and so
export const showUsers = (unitNo) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("users")
      .where("unitNo", "==", unitNo)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };
};
