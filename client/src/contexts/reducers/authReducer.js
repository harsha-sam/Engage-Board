import {
  SET_IS_LOADING,
  SET_USER,
} from "../actionTypes";

export const authInitialState = {
  user: null,
  isLoading: true,
}

export const authReducer = (state = authInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_USER: {
      return { ...state, user: payload }
    }
    case SET_IS_LOADING: {
      return { ...state, isLoading: payload }
    }
    default:
      return state
  }
}