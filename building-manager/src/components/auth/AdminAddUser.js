import React, { useState } from "react";
import { connect } from "react-redux";
import { addUserByAdmin } from "../../store/actions/authActions";

const AdminAddUser = (props) => {
  const { onUserAddByAdmin } = props;
  const [email, setEmail] = useState(null);
  const [unitNo, setUnitNo] = useState(null);

  const userAdditionByAdminHandler = (e) => {
    e.preventDefault(); // prevents page refresh
    console.log("Reached admin register handler");
    onUserAddByAdmin({
      email,
      unitNo,
    });
  };

  return (
    <div>
      <h3>Assign the unit number to the tenant</h3>
      <form onSubmit={userAdditionByAdminHandler}>
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

        <label>Unit Number</label>
        <br></br>
        <input
          type="input"
          defaultValue={unitNo}
          onChange={(e) => setUnitNo(e.target.value)}
          required
        />
        <br></br>
        <br></br>
        <input type="submit" value="Assign the unit" />
      </form>
      <br></br>
      <br></br>
      <a href="/">Home</a>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUserAddByAdmin: ({ email, unitNo }) =>
      dispatch(
        addUserByAdmin({
          email,
          unitNo,
        })
      ),
  };
};

export default connect(null, mapDispatchToProps)(AdminAddUser);
