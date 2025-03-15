import api from "../../api";
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from "./actionTypes";
import { toast } from "react-toastify";

export const postLoginData = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // Debugging: Log the request payload
    console.log("Sending login request:", { email, password });

    const { data } = await api.post('/auth/login', { email, password });

    // Debugging: Log the response received
    console.log("Login success response:", data);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('token', data.token);
    toast.success(data.msg);
  }
  catch (error) {
    console.error("Login Error:", error);

    const msg = error.response?.data?.msg || "Internal Server Error";
    dispatch({
      type: LOGIN_FAILURE,
      payload: { msg }
    });

    toast.error(msg);
  }
}

export const saveProfile = (token) => async (dispatch) => {
  try {
    if (!token) {
      console.error("No token provided for profile request.");
      return;
    }

    console.log("Fetching profile with token:", token);

    const { data } = await api.get('/profile', {
      headers: { Authorization: token }
    });
      
      dispatch({
        type: SAVE_PROFILE,
        payload: { user: data.user, token },
      });
    

    console.log("Profile data received:", data);

    dispatch({
      type: SAVE_PROFILE,
      payload: { user: data.user, token },
    });
  }
  catch (error) {
    console.error("Profile Fetch Error:", error.response?.data || error.message);
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
  document.location.href = '/';
}
