import {
  SET_IS_LOADING,
  LOAD_NOTES,
  LOAD_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  REMOVE_NOTE
} from "../actionTypes";

export const notesInitialState = {
  notes: [],
  note: null,
  isLoading: false,
}

export const notesReducer = (state = notesInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_NOTES: {
      return {
        ...state,
        notes: payload
      }
    }
    case LOAD_NOTE: {
      return {
        ...state,
        note: payload
      }
    }
    case ADD_NOTE: {
      return {
        ...state,
        notes: [payload, ...state.notes]
      }
    }
    case EDIT_NOTE: {
      return {
        ...state,
        note: payload
      }
    }
    case REMOVE_NOTE: {
      let newNotes = state.notes.filter((note) => note.id !== payload.id)
      return {
        ...state,
        notes: newNotes
      }
    }
    case SET_IS_LOADING: {
      return { ...state, isLoading: payload }
    }
    default:
      return state
  }
}