import React, { useEffect, useContext, useReducer } from "react";
import { useAuthContext } from "./AuthContext.jsx";
import {
  classroomsInitialState,
  classroomsReducer,
} from "./reducers/classroomsReducer";
import {
  SET_IS_LOADING,
  LOAD_CLASSROOMS,
  ADD_CLASSROOM,
  ADD_REQUEST,
  WITHDRAW_REQUEST,
} from "./actionTypes";
import {
  axiosInstance,
  classrooms_URL,
  requests_URL,
  classroom_users_URL,
} from "../api-config";
import { message } from "antd";

const ClassroomsContext = React.createContext();

export const ClassroomsProvider = ({ children }) => {
  const [classroomsState, classroomsDispatch] = useReducer(
    classroomsReducer,
    classroomsInitialState
  );
  const {
    authState: { user },
  } = useAuthContext();
  const getClassrooms = () => {
    // fetches list of all classrooms, user classrooms and classroom requests of the user
    classroomsDispatch({ type: SET_IS_LOADING, payload: true });
    axiosInstance
      .get(classrooms_URL)
      .then((response) => {
        classroomsDispatch({ type: LOAD_CLASSROOMS, payload: response.data });
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      })
      .finally(() =>
        classroomsDispatch({ type: SET_IS_LOADING, payload: false })
      );
  };

  useEffect(() => {
    // on mount, fetch all classrooms
    getClassrooms();
    // 1 minute interval to update classrooms
    const interval = setInterval(() => {
      getClassrooms();
    }, [60000]);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const addClassroom = (payload) => {
    // create new classroom
    return axiosInstance
      .post(classrooms_URL, payload)
      .then((response) => {
        classroomsDispatch({ type: ADD_CLASSROOM, payload: response.data });
        message.success("Classroom is created successfully");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const postRequest = (payload) => {
    // create a new joining request to a classroom
    return axiosInstance
      .post(requests_URL, payload)
      .then((response) => {
        classroomsDispatch({ type: ADD_REQUEST, payload: response.data });
        message.success("Request Sent");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const withdrawRequest = (payload) => {
    // Withdrawing a request from classroom
    return axiosInstance
      .delete(`${requests_URL}/?classroom_id=${payload.id}`)
      .then(() => {
        classroomsDispatch({ type: WITHDRAW_REQUEST, payload });
        message.success("Request Withdrawn");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const leaveClassroom = (payload) => {
    // leaving a classroom
    axiosInstance
      .patch(`${classroom_users_URL}`, payload)
      .then(() => {
        if (payload.user_id === user.id) {
          // if current user left
          message.success("Left the classroom");
          window.location.reload(false);
        } else {
          // if another user was removed from classroom by the admin or monitor
          message.success("Removed from classroom");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const addUserToClassroom = (payload) => {
    // adding a user to a classroom
    axiosInstance
      .post(`${classroom_users_URL}`, payload)
      .then(() => {
        // message.success(
        //   "User has been added. Please refresh the page to see changes"
        // );
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  return (
    <ClassroomsContext.Provider
      value={{
        classroomsState,
        classroomsActions: {
          getClassrooms,
          addClassroom,
          addUserToClassroom,
          leaveClassroom,
          postRequest,
          withdrawRequest,
        },
      }}
    >
      {children}
    </ClassroomsContext.Provider>
  );
};

export const useClassroomsContext = () => useContext(ClassroomsContext);
