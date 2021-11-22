import {
  SET_IS_LOADING,
  LOAD_CLASSROOMS,
  ADD_CLASSROOM,
  ADD_REQUEST,
  WITHDRAW_REQUEST,
} from "../actionTypes";

export const classroomsInitialState = {
  classrooms: [], // list of all classrooms info
  userClassrooms: [], // list of classroom ids user is a part of
  classroomRequests: [], // list of classroom ids requests by user
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
      // whenever a new classroom is created, classrooms should be updated with the new classroom info and user classrooms with the id
      return {
        ...state,
        classrooms: [payload, ...state.classrooms,],
        userClassrooms: [payload.id, ...state.userClassrooms]
      }
    }
    case ADD_REQUEST: {
      // whenever a new joining request is placed, classroom requests should store the id
      return {
        ...state,
        classroomRequests: [payload.classroom_id, ...state.classroomRequests,]
      }
    }
    case WITHDRAW_REQUEST: {
      // whenever a request is withdrawn, classroom requests should be filtered
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