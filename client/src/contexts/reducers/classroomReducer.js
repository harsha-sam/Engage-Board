import {
  LOAD_CLASSROOM,
} from '../actionTypes';

export const classroomInitialState = {
  name: '',
  description: '',
  members: [],
}

export const classroomReducer = (state = classroomInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CLASSROOM: {
      return ({ ...state, ...payload })
    }
    default:
      return state
  }
}
