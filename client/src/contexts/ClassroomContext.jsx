import React, {
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router";
import {
  classroomInitialState,
  classroomReducer,
} from "./reducers/classroomReducer";
import {
  LOAD_CLASSROOM,
  LOAD_CLASSROOM_REQUESTS,
  SET_CONTENT_MODERATION,
  SET_IS_LOADING,
  ADD_CHANNEL_TO_CLASSROOM,
  REMOVE_CHANNEL_FROM_CLASSROOM,
  UPDATE_CHANNEL_OF_CLASSROOM,
  ADD_MEMBER_TO_CLASSROOM,
  REMOVE_MEMBER_FROM_CLASSROOM,
} from "./actionTypes";
import {
  CONTENT_MODERATION_UPDATE,
  NEW_MEMBER,
  REMOVE_MEMBER,
  DELETE_CLASSROOM,
  NEW_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL
} from "./socketevents"
import {
  axiosInstance,
  classrooms_URL,
  requests_URL,
  channels_URL,
} from "../api-config";
import { message } from "antd";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const ClassroomContext = React.createContext();

export const ClassroomProvider = ({ children }) => {
  const {
    authState: { user },
  } = useAuthContext();
  const [classroomState, classroomDispatch] = useReducer(
    classroomReducer,
    classroomInitialState
  );
  const socketRef = useRef();
  let navigate = useNavigate();

  const setupSocketListener = useCallback(() => {
    socketRef.current.on(CONTENT_MODERATION_UPDATE, async (data) => {
      classroomDispatch({
        type: SET_CONTENT_MODERATION,
        payload: data,
      });
    });
    socketRef.current.on(NEW_CHANNEL, (payload) => {
      classroomDispatch({
        type: ADD_CHANNEL_TO_CLASSROOM,
        payload,
      });
      message.success(`New channel ${payload.name} has been added`);
    });
    socketRef.current.on(UPDATE_CHANNEL, (payload) => {
      classroomDispatch({
        type: UPDATE_CHANNEL_OF_CLASSROOM,
        payload
      })
    })
    socketRef.current.on(REMOVE_CHANNEL, (payload) => {
      classroomDispatch({
        type: REMOVE_CHANNEL_FROM_CLASSROOM,
        payload,
      });
      message.success(`Channel ${payload.name} has been removed`);
    });
    socketRef.current.on(NEW_MEMBER, (payload) => {
      classroomDispatch({
        type: ADD_MEMBER_TO_CLASSROOM,
        payload,
      });
      message.success(`${payload.full_name} has been added to this classroom`);
    });
    socketRef.current.on(REMOVE_MEMBER, (payload) => {
      classroomDispatch({
        type: REMOVE_MEMBER_FROM_CLASSROOM,
        payload,
      });
      if (payload.id === user.id) {
        navigate("/error", {
          state: {
            title: "Forbidden",
            status: "403",
            subTitle: "You have been removed from this classroom.",
          },
        });
      }
    });
    socketRef.current.on(DELETE_CLASSROOM, (payload) => {
      navigate("/error", {
        state: {
          subTitle: "Classroom not found. Must have been deleted",
        },
      });
    });
  }, [navigate, user.id]);

  useEffect(() => {
    if (classroomState.id) {
      // initializing socket connection with classroom id
      socketRef.current = io(process.env.REACT_APP_API_BASE_URL, {
        query: {
          classroom_id: classroomState.id,
        },
      });
      setupSocketListener();
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [classroomState.id, setupSocketListener]);

  const getClassroom = useCallback(
    (payload) => {
      // fetches specific classroom info (name, description, members, categories, and channels)
      axiosInstance
        .get(`${classrooms_URL}/${payload.id}`)
        .then((response) => {
          classroomDispatch({ type: LOAD_CLASSROOM, payload: response.data });
        })
        .catch((err) => {
          if (err?.response?.status === 403) {
            // if the current user is not part of this classroom (forbidden)
            navigate("/error403");
          } else if (err?.response?.status === 400) {
            // if this classroom does not exist.
            navigate("/error");
          }
          message.error(err?.response?.data?.error || "something went wrong");
        });
    },
    [navigate]
  );

  const getRequests = useCallback(() => {
    // pending joining requests of the classroom
    if (classroomState.id) {
      classroomDispatch({ type: SET_IS_LOADING, payload: true });
      axiosInstance
        .get(`${requests_URL}/?classroom_id=${classroomState.id}`)
        .then((response) => {
          classroomDispatch({
            type: LOAD_CLASSROOM_REQUESTS,
            payload: response.data,
          });
        })
        .catch((err) => {
          message.error(err?.response?.data?.error || "something went wrong");
          classroomDispatch({ type: SET_IS_LOADING, payload: false });
        });
    }
  }, [classroomState.id]);

  const saveContentModerationSettings = (payload) => {
    // updating content moderation settings of the classroom
    if (classroomState.id) {
      payload.classroom_id = classroomState.id;
      axiosInstance
        .patch(classrooms_URL, payload)
        .then((response) => {
          classroomDispatch({
            type: SET_CONTENT_MODERATION,
            payload: response.data,
          });
          message.success("Successfully saved");
        })
        .catch((err) => {
          message.error(err?.response?.data?.error || "something went wrong");
        });
    }
  };

  const addChannel = (payload) => {
    // adding new channel to the classroom
    payload.classroom_id = classroomState.id;
    axiosInstance
      .post(channels_URL, payload)
      .then((response) => {
        // message.success("Successfully added the channel. Please refresh");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const editChannel = (payload) => {
    // updating existing channel of the classroom
    payload.classroom_id = classroomState.id;
    axiosInstance
      .patch(`${channels_URL}/${payload.id}`, payload)
      .then((response) => {
        // message.success("Successfully updated the channel. Please refresh");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  const removeChannel = (payload) => {
    // deleting existing channel of the classroom
    axiosInstance
      .delete(
        `${channels_URL}/?classroom_id=${classroomState.id}&channel_id=${payload.id}`
      )
      .then((response) => {
        // message.success("Successfully removed the channel. Please refresh");
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      });
  };

  return (
    <ClassroomContext.Provider
      value={{
        classroomState,
        classroomActions: {
          getClassroom,
          getRequests,
          saveContentModerationSettings,
          addChannel,
          editChannel,
          removeChannel,
        },
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroomContext = () => useContext(ClassroomContext);
