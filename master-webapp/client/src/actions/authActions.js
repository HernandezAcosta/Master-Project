import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login")) // re-direct to login on successful register
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage

// Set token to localStorage
      const { token } = res.data;
      console.log("res.data: " + JSON.stringify(res.data));

      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log("decoded: " + JSON.stringify(decoded));
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Update - get user token
export const updateUser = userData => dispatch => {
  console.log("Update User: " + JSON.stringify(userData));
  console.log("Update User userData.id: " + userData.id);
  console.log("Update User userData.currentRole: " + userData.currentRole);

  axios.post(`/api/users/elementUpdate/` + userData.id, {currentRole: userData.currentRole})
    .then(res => {
      const token = res.data.token;

      var currentToken = localStorage.getItem("jwtToken");
      console.log("Update User currentToken: " + JSON.stringify(currentToken));

      localStorage.setItem("jwtToken", token);

      var newToken = localStorage.getItem("jwtToken");
      console.log("Update User newToken: " + JSON.stringify(newToken));

      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log("Update User Roles decoded: " + JSON.stringify(decoded));
      // Set current user
      dispatch(setCurrentUser(decoded));

    }).catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );



};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
