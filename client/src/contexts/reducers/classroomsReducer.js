import {
  SET_IS_LOADING,
  LOAD_CLASSROOMS,
  ADD_CLASSROOM,
  LEAVE_CLASSROOM,
  ADD_REQUEST,
  WITHDRAW_REQUEST,
} from "../actionTypes";

export const classroomsInitialState = {
  classrooms: [],
  userClassrooms: [],
  classRequests: [],
  isLoading: false,
}

export const classroomsReducer = (state = classroomsInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CLASSROOMS: {
      return {
        ...state,
        classrooms: payload.classrooms,
        userClassrooms: payload.userClassrooms,
        classroomRequests: payload.classroomRequests
      }
    }
    case ADD_CLASSROOM: {
      return {
        ...state,
        classrooms: [...state.classrooms, payload],
        userClassrooms: [...state.userClassrooms, payload.id]
      }
    } 
    case LEAVE_CLASSROOM: {
      let classroom_id = payload.classroom_id;
      return {
        ...state,
        userClassrooms: state.userClassrooms.filter((id => id !== classroom_id))
      }
    } 
    case ADD_REQUEST: {
      return {
        ...state,
        classroomRequests: [...state.classroomRequests, payload.classroom_id]
      }
    }
    case WITHDRAW_REQUEST: {
      let classroom_id = payload.id;
      let newClassroomRequests = state.classroomRequests.filter((id) => id !== classroom_id)
      return {
        ...state,
        classroomRequests: newClassroomRequests,
      }
    }
    case SET_IS_LOADING: {
      return { ...state, isLoading: payload }
    }
    default:
      return state
  }
}