import React, { useState } from "react";
import { connect } from "react-redux";
import { registerUserByAdmin } from "../../store/actions/authActions";
// import firebase from "firebase/app";
// import { useHistory } from "react-router";

const AdminRegisterUser = (props) => {
  const { onUserRegisterByAdmin } = props;
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNo, setPhoneNo] = useState(null);
  const [unitNo, setUnitNo] = useState(null);

  //   const history = useHistory();

  const userRegisterByAdminHandler = (e) => {
    e.preventDefault(); // prevents page refresh
    console.log("Reached admin register handler");
    onUserRegisterByAdmin({
      email,
      password,
      firstName,
      lastName,
      unitNo,
      phoneNo,
    });
  };

  //   firebase.auth().onAuthStateChanged(function (user) {
  //     if (user) {
  //       // User is signed in.
  //       console.log("Header logged in if -> " + user.uid);
  //       user.getIdTokenResult().then((idTokenResult) => {
  //         // console.log(idTokenResult.claims);
  //         if (idTokenResult.claims.admin) {
  //           history.push("/admin");
  //         } else if (idTokenResult.claims.superUser) {
  //           history.push("/superuser");
  //         } else {
  //           history.push("/");
  //         }
  //       });

  //       // setUserId(user.uid);
  //       // setUserName(user.displayName);
  //     } else {
  //       // No user is signed in.
  //       // console.log("Header else -> ");
  //       // setUserId(null);
  //       // setUserName(null);
  //     }
  //   });

  return (
    <div>
      <form>
        <br></br>
        <br></br>
        <label>Enter Email Id</label>
        <br></br>

        <input
          type="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <br></br>

        <label>Enter password</label>
        <br></br>
        <input
          type="password"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br>
        <br></br>
        <br></br>

        <label>First Name</label>
        <br></br>
        <input
          type="input"
          defaultValue={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br></br>
        <br></br>

        <label>Last Name</label>
        <br></br>
        <input
          type="input"
          defaultValue={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br></br>
        <br></br>

        <label>Phone</label>
        <br></br>
        <input
          type="input"
          defaultValue={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
        />
        <br></br>
        <br></br>

        <label>Unit Number</label>
        <br></br>
        <input
          type="input"
          defaultValue={unitNo}
          onChange={(e) => setUnitNo(e.target.value)}
        />
        <br></br>
        <br></br>
        <input
          onClick={userRegisterByAdminHandler}
          type="submit"
          value="Register This User"
        />
      </form>
      <br></br>
      <br></br>
      <a href="/">Home</a>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUserRegisterByAdmin: ({
      email,
      password,
      firstName,
      lastName,
      unitNo,
      phoneNo,
    }) =>
      dispatch(
        registerUserByAdmin({
          email,
          password,
          firstName,
          lastName,
          unitNo,
          phoneNo,
        })
      ),
  };
};

export default connect(null, mapDispatchToProps)(AdminRegisterUser);
