import {
  LOAD_CLASSROOM,
  LOAD_CLASSROOM_REQUESTS,
  SET_IS_LOADING
} from '../actionTypes';

export const classroomInitialState = {
  id: '',
  name: '',
  description: '',
  members: [],
  requests: [],
  isLoading: false,
}

export const classroomReducer = (state = classroomInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CLASSROOM: {
      return ({ ...state, ...payload, isLoading: false })
    }
    case LOAD_CLASSROOM_REQUESTS: {
      return ({ ...state, requests: payload, isLoading: false })
    }
    case SET_IS_LOADING: {
      return ({...state, isLoading: payload})
    }
    default:
      return state
  }
}
