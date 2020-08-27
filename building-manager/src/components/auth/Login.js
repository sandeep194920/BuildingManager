import React, { useState } from "react";
import { connect } from "react-redux";
import { login } from "../../store/actions/authActions";

const Login = (props) => {
  const { onLoginUser } = props;
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);

  const loginHandler = (e) => {
    e.preventDefault(); // prevents page refresh
    console.log("REached login handler");
    onLoginUser(email, pass);
  };

  return (
    <div>
      <form>
        <br></br>
        <br></br>
        <label>Enter username</label>
        <br></br>

        <input
          type="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <br></br>

        <label onClick={loginHandler}>Enter password</label>
        <br></br>
        <input
          type="password"
          defaultValue={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <br></br>
        <br></br>
        <input onClick={loginHandler} type="submit" value="Login" />
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginUser: (email, password, history) =>
      dispatch(login(email, password, history)),
  };
};

export default connect(null, mapDispatchToProps)(Login);
