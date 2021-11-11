import React, {
  useEffect,
  useContext,
  useReducer
} from 'react';
import {
  authInitialState,
  authReducer
} from './reducers/authReducer';
import {
  SET_IS_LOADING,
  SET_USER,
} from './actionTypes';
import { axiosInstance, user_URL, signin_URL, signup_URL, signout_URL } from '../api-config/';
import { message } from 'antd'


const AuthContext = React.createContext();

export const AuthProvider = ({
  children
}) => {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      authDispatch({ type: SET_IS_LOADING, payload: true })
      axiosInstance.get(user_URL)
        .then((response) => {
          authDispatch({ type: SET_USER, payload: response.data })
          message.success('Logged in !');
        })
        .catch((err) => {
          message.warning('Session expired, please login again')
        })
        .finally(() => authDispatch({ type: SET_IS_LOADING, payload: false }))
    }
  }, [])

  const setUser = (payload) => {
    localStorage.setItem("access-token", payload.accessToken);
    localStorage.setItem("refresh-token", payload.refreshToken);
    localStorage.setItem("expires-in", payload.expiresIn);
    return authDispatch({ type: SET_USER, payload: payload.user })
  }

  const signup = (payload) => {
    axiosInstance.post(signup_URL, payload)
      .then(() => {
        message.success('Registered !');
      })
      .catch((err) => {
        message.error(err.response.data.error);
      })
  }

  const signin = (payload) => {
    axiosInstance.post(signin_URL, payload)
      .then((response) => {
        setUser({
          user: response.data,
          accessToken: response.headers['access-token'],
          refreshToken: response.headers['refresh-token'],
          expiresIn: response.headers['expires-in'],
        })
        message.success('Logged in !');
      })
      .catch((err) => {
        message.error(err.response.data.error);
      })
  }

  const signout = (payload) => {
    axiosInstance.delete(signout_URL, payload)
      .then(() => {
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        localStorage.removeItem("expires-in");
        message.success('Logged out !');
        window.location.reload(false);
      })
      .catch((err) => {
        message.error(err.response.data.error);
      })
  }

  return <AuthContext.Provider
    value={
      {
        authState,
        authActions: {
          setUser,
          signup,
          signin,
          signout
        }
      }
    }
  >
    {children}
  </AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext);