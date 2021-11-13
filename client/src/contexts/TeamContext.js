import React, {
  useEffect,
  useContext,
  useReducer
} from 'react';
import {
  teamsInitialState,
  teamsReducer
} from './reducers/teamsReducer';
import {
  SET_IS_LOADING,
  LOAD_TEAMS,
  ADD_TEAM,
  ADD_REQUEST,
  WITHDRAW_REQUEST,
  LEAVE_TEAM,
} from './actionTypes';
import { axiosInstance, teams_URL, requests_URL, team_users_URL } from '../api-config/';
import { message } from 'antd'
import axios from 'axios';


const TeamsContext = React.createContext();

export const TeamsProvider = ({
  children
}) => {
  const [teamsState, teamsDispatch] = useReducer(teamsReducer, teamsInitialState);

  const getTeams = () => {
    teamsDispatch({ type: SET_IS_LOADING, payload: true })
    axiosInstance.get(teams_URL)
      .then((response) => {
        teamsDispatch({ type: LOAD_TEAMS, payload: response.data })
      })
      .catch((err) => {
        
      })
      .finally(() => teamsDispatch({ type: SET_IS_LOADING, payload: false }))
  }

  useEffect(() => {
    getTeams();
  }, [])

  const addTeam = (payload) => {
    axiosInstance.post(teams_URL, payload)
      .then((response) => {
        teamsDispatch({ type: ADD_TEAM, payload: response.data })
        message.success('Team is created successfully')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
      .finally(() => teamsDispatch({ type: SET_IS_LOADING, payload: false }))
  }

  const postRequest = (payload) => {
    axiosInstance.post(requests_URL, payload)
      .then((response) => {
        teamsDispatch({ type: ADD_REQUEST, payload: response.data })
        message.success('Request Sent')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const withdrawRequest = (payload) => {
    axiosInstance.delete(`${requests_URL}/?team_id=${payload.id}`)
      .then(() => {
        teamsDispatch({ type: WITHDRAW_REQUEST, payload})
        message.success('Request Withdrawn')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  const leaveTeam = (payload) => {
    axiosInstance.patch(`${team_users_URL}`, payload)
      .then(() => {
        teamsDispatch({ type: LEAVE_TEAM, payload })
        message.success('Left the classroom')
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
  }

  return <TeamsContext.Provider
    value={
      {
        teamsState,
        teamsActions: {
          getTeams,
          addTeam,
          leaveTeam,
          postRequest,
          withdrawRequest
        }
      }
    }
  >
    {children}
  </TeamsContext.Provider>
}

export const useTeamsContext = () => useContext(TeamsContext);