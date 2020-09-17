import React, { useState } from "react";
import { connect } from "react-redux";
import { addUserByAdmin } from "../../store/actions/authActions";

const AdminAddUser = (props) => {
  const { onUserAddByAdmin } = props;
  const [email, setEmail] = useState(null);
  const [unitNo, setUnitNo] = useState(null);
  const [selectedOption, setSelectedOption] = useState("leasee");

  const userAdditionByAdminHandler = (e) => {
    e.preventDefault(); // prevents page refresh
    console.log("Reached admin register handler");
    onUserAddByAdmin({
      email,
      unitNo,
      selectedOption,
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

        <label>Is this user leasee or occupant ?</label>
        {/* <form> */}
        <div className="radio">
          <label>
            <input
              type="radio"
              value="leasee"
              checked={selectedOption === "leasee"}
              onChange={() => setSelectedOption("leasee")}
            />
            Leasee
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              value="occupant"
              checked={selectedOption === "occupant"}
              onChange={() => setSelectedOption("occupant")}
            />
            Occupant
          </label>
        </div>
        {/* </form> */}
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
    onUserAddByAdmin: ({ email, unitNo, selectedOption }) =>
      dispatch(
        addUserByAdmin({
          email,
          unitNo,
          selectedOption,
        })
      ),
  };
};

export default connect(null, mapDispatchToProps)(AdminAddUser);
