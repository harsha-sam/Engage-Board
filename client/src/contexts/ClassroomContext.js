import React, {
  useContext,
  useReducer
} from 'react';
import {
  classroomInitialState,
  classroomReducer
} from './reducers/classroomReducer';
import {
  LOAD_CLASSROOM,
} from './actionTypes';
import { axiosInstance, classrooms_URL } from '../api-config';
import { message } from 'antd'


const ClassroomContext = React.createContext();

export const ClassroomProvider = ({
  children
}) => {
  const [classroomState, classroomDispatch] = useReducer(classroomReducer, classroomInitialState);

  const getClassroom = (payload) => {
    axiosInstance.get(`${classrooms_URL}/${payload.id}`)
      .then((response) => {
        classroomDispatch({ type: LOAD_CLASSROOM, payload: response.data })
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  return <ClassroomContext.Provider
    value={
      {
        classroomState,
        classroomActions: {
          getClassroom
        }
      }
    }
  >
    {children}
  </ClassroomContext.Provider>
}

export const useClassroomContext = () => useContext(ClassroomContext);