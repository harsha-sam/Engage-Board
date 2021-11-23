import {
  SET_IS_LOADING,
  LOAD_CHAT,
  SET_CHANNEL,
  SET_RECEIVER,
  ADD_MESSAGE_TO_CHAT,
  ADD_REACTION_TO_MESSAGE,
  REMOVE_REACTION_TO_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE
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
      return ({ ...state, isLoading: payload })
    }
    case LOAD_CHAT: {
      return ({ ...state, messagesList: payload })
    }
    case SET_CHANNEL: {
      // current channel of the classroom
      return ({ ...state, channel: payload, receiver: null, messagesList: [], isLoading: false })
    }
    case SET_RECEIVER: {
      // direct message receiver
      return ({ ...state, receiver: payload, channel: null, messagesList: [], isLoading: false })
    }
    case ADD_MESSAGE_TO_CHAT: {
      let messagesList = [...state.messagesList]
      return ({ ...state, messagesList: [...messagesList, payload] })
    }
    case ADD_REACTION_TO_MESSAGE: {
      let messagesList = [...state.messagesList]
      // that specific message
      let messageIndex = messagesList.findIndex((message) => message.id === payload.message_id)
      // reactions for this message
      let newReactions = [...messagesList[messageIndex].reactions]
      // specific reaction
      let reactionIndex = newReactions.findIndex((reaction) => reaction.key === payload.reaction)
      if (reactionIndex === -1) {
        // creating new reaction
        newReactions.push({
          key: payload.reaction,
          title: payload.reaction,
          users: [payload.user],
          count: 1
        })
      }
      else {
        // updating existing reaction count
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
      // that specific message
      let messageIndex = messagesList.findIndex((message) => message.id === payload.message_id)
      // reactions for that message
      let reactions = [...messagesList[messageIndex].reactions]
      // specific reaction
      let reactionIndex = reactions.findIndex((reaction) => reaction.key === payload.reaction)
      // updating count
      reactions[reactionIndex].users = reactions[reactionIndex].users.filter((user) => user.id !== payload.user.id)
      reactions[reactionIndex].count = reactions[reactionIndex].users.length
      if (reactions[reactionIndex].count < 0) {
        reactions[reactionIndex].count = 0
      }
      messagesList[messageIndex].reactions = reactions;
      return ({ ...state, messagesList, isLoading: false })
    }
    case EDIT_MESSAGE: {
      let messagesList = [...state.messagesList]
      let messageIndex = messagesList.findIndex((message) => message.id === payload.message_id)
      let newMessage = { ...messagesList[messageIndex] }
      newMessage.content = payload.new_content
      newMessage.updatedAt = payload.updatedAt
      messagesList[messageIndex] = newMessage;
      return ({ ...state, messagesList })
    }
    case DELETE_MESSAGE: {
      let newMessagesList = state.messagesList.filter(msg => msg.id !== payload.message_id)
      return ({ ...state, messagesList: newMessagesList })
    }
    default:
      return state
  }
}
