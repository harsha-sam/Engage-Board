import {
  SET_IS_LOADING,
  LOAD_TEAMS,
  ADD_TEAM,
  LEAVE_TEAM,
  ADD_REQUEST,
  WITHDRAW_REQUEST,
} from "../actionTypes";

export const teamsInitialState = {
  teams: [],
  userTeams: [],
  teamRequests: [],
  isLoading: false,
}

export const teamsReducer = (state = teamsInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_TEAMS: {
      return {
        ...state,
        teams: payload.teams,
        userTeams: payload.userTeams,
        teamRequests: payload.teamRequests
      }
    }
    case ADD_TEAM: {
      return {
        ...state,
        teams: [...state.teams, payload],
        userTeams: [...state.userTeams, payload.id]
      }
    } 
    case LEAVE_TEAM: {
      let team_id = payload.team_id;
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== team_id),
        userTeams: state.userTeams.filter((id => id !== team_id))
      }
    } 
    case ADD_REQUEST: {
      return {
        ...state,
        teamRequests: [...state.teamRequests, payload.team_id]
      }
    }
    case WITHDRAW_REQUEST: {
      let team_id = payload.id;
      let newTeamRequests = state.teamRequests.filter((id) => id !== team_id)
      return {
        ...state,
        teamRequests: newTeamRequests,
      }
    }
    case SET_IS_LOADING: {
      return { ...state, isLoading: payload }
    }
    default:
      return state
  }
}