import React, { useState } from "react";
import { connect } from "react-redux";
import { register } from "../../store/actions/authActions";

const Register = (props) => {
  const { onRegister } = props;
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNo, setPhoneNo] = useState(null);
  // const [unitNo, setUnitNo] = useState(null);

  const registerHandler = (e) => {
    e.preventDefault(); // prevents page refresh
    console.log("Reached admin register handler");
    onRegister({
      email,
      password,
      firstName,
      lastName,
      // unitNo,
      phoneNo,
    });
  };

  return (
    <div>
      <form onSubmit={registerHandler}>
        <br></br>
        <br></br>
        <label>Enter Email Id</label>
        <br></br>

        <input
          type="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br></br>
        <br></br>

        <label>Enter password</label>
        <br></br>
        <input
          type="password"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          required
        />
        <br></br>
        <br></br>

        <label>Last Name</label>
        <br></br>
        <input
          type="input"
          defaultValue={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br></br>
        <br></br>

        <label>Phone</label>
        <br></br>
        <input
          type="input"
          defaultValue={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <input type="submit" value="Register This User" />
      </form>
      <br></br>
      <br></br>
      <a href="/">Home</a>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRegister: ({ email, password, firstName, lastName, phoneNo }) =>
      dispatch(
        register({
          email,
          password,
          firstName,
          lastName,
          // unitNo,
          phoneNo,
        })
      ),
  };
};

export default connect(null, mapDispatchToProps)(Register);
