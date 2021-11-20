import React, { useContext, useReducer } from "react";
import { usersInitialState, usersReducer } from "./reducers/usersReducer";
import { SET_IS_LOADING, SET_ALL_USERS } from "./actionTypes";
import { axiosInstance, users_URL } from "../api-config";
import { message } from "antd";

const UsersContext = React.createContext();

export const UsersProvider = ({ children }) => {
  const [usersState, usersDispatch] = useReducer(
    usersReducer,
    usersInitialState
  );

  const getListOfUsers = () => {
    usersDispatch({ type: SET_IS_LOADING, payload: true });
    axiosInstance
      .get(users_URL)
      .then((response) => {
        usersDispatch({ type: SET_ALL_USERS, payload: response.data });
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      })
      .finally(() => {
        usersDispatch({ type: SET_IS_LOADING, payload: false });
      });
  };

  return (
    <UsersContext.Provider
      value={{
        usersState,
        usersActions: {
          getListOfUsers,
        },
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
