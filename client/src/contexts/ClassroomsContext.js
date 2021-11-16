import React, {
  useEffect,
  useContext,
  useReducer
} from 'react';
import {
  classroomsInitialState,
  classroomsReducer
} from './reducers/classroomsReducer';
import {
  SET_IS_LOADING,
  LOAD_CLASSROOMS,
  ADD_CLASSROOM,
  ADD_REQUEST,
  WITHDRAW_REQUEST,
  LEAVE_CLASSROOM,
} from './actionTypes';
import { axiosInstance, classrooms_URL, requests_URL, classroom_users_URL } from '../api-config';
import { message } from 'antd'
import { useAuthContext } from './AuthContext';


const ClassroomsContext = React.createContext();

export const ClassroomsProvider = ({
  children
}) => {
  const [classroomsState, classroomsDispatch] = useReducer(classroomsReducer, classroomsInitialState);
  const { authState: { user }} = useAuthContext();
  const getClassrooms = () => {
    classroomsDispatch({ type: SET_IS_LOADING, payload: true })
    axiosInstance.get(classrooms_URL)
      .then((response) => {
        classroomsDispatch({ type: LOAD_CLASSROOMS, payload: response.data })
      })
      .catch((err) => {
        
      })
      .finally(() => classroomsDispatch({ type: SET_IS_LOADING, payload: false }))
  }

  useEffect(() => {
    getClassrooms();
  }, [])

  const addClassroom = (payload) => {
    axiosInstance.post(classrooms_URL, payload)
      .then((response) => {
        classroomsDispatch({ type: ADD_CLASSROOM, payload: response.data })
        message.success('Classroom is created successfully')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
      .finally(() => classroomsDispatch({ type: SET_IS_LOADING, payload: false }))
  }

  const postRequest = (payload) => {
    axiosInstance.post(requests_URL, payload)
      .then((response) => {
        classroomsDispatch({ type: ADD_REQUEST, payload: response.data })
        message.success('Request Sent')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const withdrawRequest = (payload) => {
    axiosInstance.delete(`${requests_URL}/?classroom_id=${payload.id}`)
      .then(() => {
        classroomsDispatch({ type: WITHDRAW_REQUEST, payload})
        message.success('Request Withdrawn')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const leaveClassroom = (payload) => {
    axiosInstance.patch(`${classroom_users_URL}`, payload)
      .then(() => {
        classroomsDispatch({ type: LEAVE_CLASSROOM, payload })
        if (payload.user_id === user.id) {
          message.success('Left the classroom')
        }
        else {
          message.success('Removed from classroom')
        }
        window.location.reload(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const addUserToClassroom = (payload) => {
    axiosInstance.post(`${classroom_users_URL}`, payload)
      .then(() => {
        message.success('User has been added. Please refresh the page to see changes')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  return <ClassroomsContext.Provider
    value={
      {
        classroomsState,
        classroomsActions: {
          getClassrooms,
          addClassroom,
          addUserToClassroom,
          leaveClassroom,
          postRequest,
          withdrawRequest
        }
      }
    }
  >
    {children}
  </ClassroomsContext.Provider>
}

export const useClassroomsContext = () => useContext(ClassroomsContext);