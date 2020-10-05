// admin notify unit tenants
export const notifyUnit = (unitNo, title, message) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    console.log(
      `The unit is ${unitNo}, title is ${title} and message is ${message}`
    );
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
          time: firestore.FieldValue.serverTimestamp(),
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

// admin notify all tenants (lease holders or occupants or all)

export const notifyAll = (tenantType, title, message) => {
  // tenantType can be leasee or occupant or both
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log(
      `Entered notifyAll() with tenantType ${tenantType}, title ${title} and message ${message}`
    );
    const firestore = getFirestore();
    // We need to notify the tenants in all the units here. If tenantType is leasee, we need to notify all the lease holders,
    // and if tenantType is occupant then all the occupants and if both then leasee and occupant.

    // steps

    // 1. Get all users whose type is mentioned in tenantType. If tenantType is both then get all users with type leasee or occupant
    // 2. Add the unit numbers of all these tenants in an array while fetching in step 1. At this point, array might contain repeated numbers
    // 3. Remove the duplicates in the array and you'll have non-repeated unit numbers array. Notify these units and set the viewable field to tenantType in the notify object so that the firestore gets this data

    // get all users object from firestore
    firestore
      .collection("users")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log(doc.data());
        });
      });
  };
};
