import {
  SET_IS_LOADING,
  SET_USER,
  UPDATE_USER,
  TOGGLE_DYSLEXIA_FONT
} from "../actionTypes";

export const authInitialState = {
  user: null,
  isLoading: true,
  dyslexiaFontToggled: false,
}

export const authReducer = (state = authInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_USER: {
      return { ...state, user: payload }
    }
    case UPDATE_USER: {
      return { ...state, user: payload }
    }
    case SET_IS_LOADING: {
      return { ...state, isLoading: payload }
    }
    case TOGGLE_DYSLEXIA_FONT: {
      return { ...state, dyslexiaFontToggled: !state.dyslexiaFontToggled }
    }
    default:
      return state
  }
}