const initState = {
  authError: null,
  authSuccess: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      console.log("Login success reducers");
      return {
        ...state,
        authError: null,
      };
    case "LOGIN_FAIL":
      console.log("Login faile reducers");

      return {
        ...state,
        authError: "Login failed",
      };
    case "REGISTRATION_SUCCESS": {
      return {
        ...state,
        authSuccess: `User ${action.registeredUser} registered successfully`,
      };
    }
    case "REGISTRATION_FAIL": {
      console.log("EXISTS REDUCER");
      return {
        ...state,
        authError: `User ${action.registeredUser} already exists`,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default authReducer;
