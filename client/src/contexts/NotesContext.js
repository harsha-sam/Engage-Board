import React, {
  useContext,
  useReducer
} from 'react';
import { useNavigate } from 'react-router';
import {
  notesInitialState,
  notesReducer
} from './reducers/notesReducer';
import {
  SET_IS_LOADING,
  LOAD_NOTES,
  LOAD_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  REMOVE_NOTE
} from "./actionTypes";
import { axiosInstance, notes_URL } from '../api-config';
import { message } from 'antd'

const NotesContext = React.createContext();

export const NotesProvider = ({
  children
}) => {
  const [notesState, notesDispatch] = useReducer(notesReducer, notesInitialState);
  let navigate = useNavigate();

  const getNotes = () => {
    notesDispatch({ type: SET_IS_LOADING, payload: true })
    axiosInstance.get(notes_URL)
      .then((response) => {
        notesDispatch({ type: LOAD_NOTES, payload: response.data })
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
      .finally(() => notesDispatch({ type: SET_IS_LOADING, payload: false }))
  }

  const getNote = (payload) => {
    notesDispatch({ type: SET_IS_LOADING, payload: true })
    axiosInstance.get(`${notes_URL}/${payload.id}`)
      .then((response) => {
        notesDispatch({ type: LOAD_NOTE, payload: response.data })
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          navigate('/error')
        }
        message.error(err?.response?.data?.error || 'something went wrong');
      })
      .finally(() => notesDispatch({ type: SET_IS_LOADING, payload: false }))
  }

  const addNote = (payload) => {
    axiosInstance.post(notes_URL, payload)
      .then((response) => {
        notesDispatch({ type: ADD_NOTE, payload: response.data })
        message.success('Note is created successfully')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const editNote = (payload) => {
    axiosInstance.patch(`${notes_URL}/${payload.id}`, payload)
      .then((response) => {
        notesDispatch({ type: EDIT_NOTE, payload: response.data })
        message.success('Note is saved')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const removeNote = (payload) => {
    axiosInstance.delete(`${notes_URL}/${payload.id}`)
      .then((response) => {
        notesDispatch({ type: REMOVE_NOTE, payload: response.data })
        message.success('Note is deleted')
        window.location.reload(false);
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  return <NotesContext.Provider
    value={
      {
        notesState,
        notesActions: {
          getNotes,
          getNote,
          addNote,
          editNote,
          removeNote
        }
      }
    }>
  {children}
  </NotesContext.Provider>
}

export const useNotesContext = () => useContext(NotesContext);