import React, {
  useContext,
  useReducer
} from 'react';
import { useNavigate } from 'react-router';
import {
  classroomInitialState,
  classroomReducer
} from './reducers/classroomReducer';
import {
  LOAD_CLASSROOM,
  LOAD_CLASSROOM_REQUESTS,
  SET_CONTENT_MODERATION,
  SET_IS_LOADING
} from './actionTypes';
import { axiosInstance, classrooms_URL, requests_URL } from '../api-config';
import { message } from 'antd'


const ClassroomContext = React.createContext();

export const ClassroomProvider = ({
  children
}) => {
  const [classroomState, classroomDispatch] = useReducer(classroomReducer, classroomInitialState);
  let navigate = useNavigate();

  const getClassroom = (payload) => {
    axiosInstance.get(`${classrooms_URL}/${payload.id}`)
      .then((response) => {
        classroomDispatch({ type: LOAD_CLASSROOM, payload: response.data })
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          navigate('/error403')
        }
        else if (err?.response?.status === 400) {
          navigate('/error')
        }
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const getRequests = () => {
    if (classroomState.id) {
      classroomDispatch({ type: SET_IS_LOADING, payload: true })
      axiosInstance.get(`${requests_URL}/?classroom_id=${classroomState.id}`)
        .then((response) => {
          classroomDispatch({ type: LOAD_CLASSROOM_REQUESTS, payload: response.data })
        })
        .catch((err) => {
          message.error(err?.response?.data?.error || 'something went wrong');
          classroomDispatch({ type: SET_IS_LOADING, payload: false })
        })
    }
  }

  const saveContentModerationSettings = (payload) => {
    if (classroomState.id) {
      axiosInstance.patch(`${classrooms_URL}/update/${classroomState.id}`, payload)
        .then((response) => {
          classroomDispatch({ type: SET_CONTENT_MODERATION, payload: response.data })
          message.success("Successfully saved")
        })
        .catch((err) => {
          message.error(err?.response?.data?.error || 'something went wrong');
        })
    }
  }

  return <ClassroomContext.Provider
    value={
      {
        classroomState,
        classroomActions: {
          getClassroom,
          getRequests,
          saveContentModerationSettings
        }
      }
    }
  >
    {children}
  </ClassroomContext.Provider>
}

export const useClassroomContext = () => useContext(ClassroomContext);