import {
  SET_IS_LOADING,
  SET_ALL_USERS,
} from "../actionTypes";

export const usersInitialState = {
  users: [],
  isLoading: false,
}

export const usersReducer = (state = usersInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_USERS: {
      return { ...state, users: payload }
    }
    case SET_IS_LOADING: {
      return { ...state, isLoading: payload }
    }
    default:
      return state
  }
}