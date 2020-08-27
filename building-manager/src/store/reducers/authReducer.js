const initState = {
  authError: null,
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
    default:
      return {
        ...state,
      };
  }
};

export default authReducer;
