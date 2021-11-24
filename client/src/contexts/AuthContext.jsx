import React, { useEffect, useContext, useReducer } from "react";
import { authInitialState, authReducer } from "./reducers/authReducer";
import {
  SET_IS_LOADING,
  SET_USER,
  UPDATE_USER,
  TOGGLE_DYSLEXIA_FONT,
} from "./actionTypes";
import { axiosInstance, user_URL, signin_URL, signup_URL } from "../api-config";
import { message } from "antd";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    // fetching user info with access token
    if (localStorage.getItem("access-token")) {
      authDispatch({ type: SET_IS_LOADING, payload: true });
      axiosInstance
        .get(user_URL)
        .then((response) => {
          authDispatch({ type: SET_USER, payload: response.data });
        })
        .catch(() => {
          message.warning("Session expired, please login again");
        })
        .finally(() => authDispatch({ type: SET_IS_LOADING, payload: false }));
    } else {
      authDispatch({ type: SET_IS_LOADING, payload: false });
    }
  }, []);

  const setUser = (payload) => {
    // storing access token and refresh token in local storage
    localStorage.setItem("access-token", payload.accessToken);
    localStorage.setItem("refresh-token", payload.refreshToken);
    // storing user info in the state
    return authDispatch({ type: SET_USER, payload: payload.user });
  };

  const updateUser = (payload) => {
    // updating profile of current user
    return axiosInstance
      .patch(user_URL, payload)
      .then((response) => {
        authDispatch({ type: UPDATE_USER, payload: response.data });
        message.success("Successfully Updated !");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const signup = (payload) => {
    return axiosInstance
      .post(signup_URL, payload)
      .then(() => {
        message.success("Registered !");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const signin = (payload) => {
    return axiosInstance
      .post(signin_URL, payload)
      .then((response) => {
        setUser({
          user: response.data,
          accessToken: response.headers["access-token"],
          refreshToken: response.headers["refresh-token"],
        });
        message.success("Logged in !");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const signout = async () => {
    // removing access token and refresh token from localStorage
    await message.loading("Logging out ...!", 1);
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    await message.success("Logged out", 0.5);
    window.location = "/";
    window.location.reload(false);
  };

  // dyslexia accessibility toggle
  const toggleDyslexiaFont = () => authDispatch({ type: TOGGLE_DYSLEXIA_FONT });

  return (
    <AuthContext.Provider
      value={{
        authState,
        authActions: {
          setUser,
          updateUser,
          signup,
          signin,
          signout,
          toggleDyslexiaFont,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
