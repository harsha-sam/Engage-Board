import {
  SET_IS_LOADING,
  LOAD_CHAT,
  SET_CHANNEL,
  SET_RECEIVER,
  ADD_MESSAGE_TO_CHAT,
  ADD_REACTION_TO_MESSAGE,
  REMOVE_REACTION_TO_MESSAGE,
} from '../actionTypes';

export const chatInitialState = {
  isLoading: false,
  messagesList: [],
  receiver: null,
  channel: null,
}

export const chatReducer = (state = chatInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_IS_LOADING: {
      return ({ ...state, isLoading: payload})
    }
    case LOAD_CHAT: {
      return ({ ...state, messagesList: payload })
    }
    case SET_CHANNEL: {
      return ({ ...state, channel: payload, receiver: null })
    }
    case SET_RECEIVER: {
      return ({ ...state, receiver: payload, channel: null })
    }
    case ADD_MESSAGE_TO_CHAT: {
      let messagesList = [...state.messagesList]
      return ({ ...state, messagesList: [...messagesList, payload] })
    }
    case ADD_REACTION_TO_MESSAGE: {
      let messagesList = [...state.messagesList]
      let messageIndex = messagesList.findIndex((message) => message.id === payload.message_id)
      let newReactions = [...messagesList[messageIndex].reactions]
      let reactionIndex = newReactions.findIndex((reaction) => reaction.key === payload.reaction)
      if (reactionIndex === -1) {
        newReactions.push({
          key: payload.reaction,
          title: payload.reaction,
          users: [payload.user],
          count: 1
        })
      }
      else {
        let users = [...newReactions[reactionIndex].users, payload.user];
        let hash = {}
        users.forEach(element => {
          if (!(element.id in hash)) {
            hash[element.id] = element
          }
        });
        newReactions[reactionIndex].users = Object.values(hash)
        newReactions[reactionIndex].count = newReactions[reactionIndex].users.length
      }
      messagesList[messageIndex].reactions = newReactions;
      return ({ ...state, messagesList, isLoading: false })
    }
    case REMOVE_REACTION_TO_MESSAGE: {
      let messagesList = [...state.messagesList]
      let messageIndex = messagesList.findIndex((message) => message.id === payload.message_id)
      let reactions = [...messagesList[messageIndex].reactions]
      let reactionIndex = reactions.findIndex((reaction) => reaction.key === payload.reaction)
      reactions[reactionIndex].users = reactions[reactionIndex].users.filter((user) => user.id !== payload.user.id )
      reactions[reactionIndex].count -= 1
      if (reactions[reactionIndex].count <= 0) {
        reactions[reactionIndex].count = 0
      }
      messagesList[messageIndex].reactions = reactions;
      return ({ ...state, messagesList, isLoading: false })
    }
    default:
      return state
  }
}
