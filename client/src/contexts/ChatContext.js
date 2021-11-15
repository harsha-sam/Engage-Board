import React, { useEffect, useContext, useReducer, useRef } from 'react'
import {
  LOAD_CHAT,
  SET_CHANNEL,
  SET_RECEIVER,
  ADD_MESSAGE_TO_CHAT,
  ADD_REACTION_TO_MESSAGE,
  REMOVE_REACTION_TO_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  SET_IS_LOADING,
} from './actionTypes.js';
import { chatReducer, chatInitialState } from './reducers/chatReducer';
import { axiosInstance, chat_URL, channels_chat_URL } from '../api-config';
import { message } from 'antd'
import { useAuthContext } from './AuthContext.js';
import { io } from 'socket.io-client';

const ChatContext = React.createContext();


const CHANNEL_NEW_CHAT_MESSAGE_EVENT = "CHANNEL_NEW_CHAT_MESSAGE_EVENT";
const CHANNEL_EDIT_MESSAGE_EVENT = "CHANNEL_EDIT_MESSAGE_EVENT";
const CHANNEL_DELETE_MESSAGE_EVENT = "CHANNEL_DELETE_MESSAGE_EVENT";
const CHANNEL_MESSAGE_NEW_REACTION_EVENT = "CHANNEL_MESSAGE_NEW_REACTION_EVENT";
const CHANNEL_MESSAGE_DELETE_REACTION_EVENT = "CHANNEL_MESSAGE_DELETE_REACTION_EVENT";

export const ChatProvider = ({
  children
}) => {
  const { authState: { user } } = useAuthContext();
  const [chatState, chatDispatch] = useReducer(chatReducer, chatInitialState);
  const socketRef = useRef();


  const selectChannel = (payload) => {
    chatDispatch({ type: SET_IS_LOADING, payload: true })
    chatDispatch({ type: SET_CHANNEL, payload: payload })
  }

  const selectReceiver = (payload) => {
    chatDispatch({ type: SET_IS_LOADING, payload: true })
    chatDispatch({ type: SET_RECEIVER, payload: payload })
  }

  const initiateSocketConnection = (obj) => {
    socketRef.current = io('http://localhost:4000', {
      query: obj
    });
    console.log(`Connecting socket...`);
  }

  const setupSocketListener= () => {
    socketRef.current.on(CHANNEL_NEW_CHAT_MESSAGE_EVENT, (message) => {
      chatDispatch({ type: ADD_MESSAGE_TO_CHAT, payload: message })
    });
    socketRef.current.on(CHANNEL_MESSAGE_NEW_REACTION_EVENT, (payload) => {
      chatDispatch({ type: SET_IS_LOADING, payload: true })
      chatDispatch({ type: ADD_REACTION_TO_MESSAGE, payload })
    });
    socketRef.current.on(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, (payload) => {
      chatDispatch({ type: SET_IS_LOADING, payload: true })
      chatDispatch({ type: REMOVE_REACTION_TO_MESSAGE, payload })
    });
    socketRef.current.on(CHANNEL_EDIT_MESSAGE_EVENT, (payload) => {
      chatDispatch({ type: EDIT_MESSAGE, payload })
    })
    socketRef.current.on(CHANNEL_DELETE_MESSAGE_EVENT, (payload) => {
      chatDispatch({ type: DELETE_MESSAGE, payload })
    })
  }

  const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if (socketRef.current) socketRef.current.disconnect();
  }

  useEffect(() => {
    if (chatState.channel && chatState.channel.id) {
      initiateSocketConnection({ channel_id: chatState.channel.id });
      setupSocketListener()
      getChannelChat(chatState.channel)
    }
    return (() => disconnectSocket())
  }, [chatState.channel])

  useEffect(() => {
    if (chatState.receiver && chatState.receiver.id) {
      initiateSocketConnection();
      getDirectMessages(chatState.receiver)
    }
    return (() => disconnectSocket())
  }, [chatState.receiver])

  const getChannelChat = (payload) => {
    chatDispatch({ type: SET_IS_LOADING, payload: true })
    axiosInstance.get(`${channels_chat_URL}/${payload.id}`)
      .then((response) => {
        chatDispatch({ type: LOAD_CHAT, payload: response.data })
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
      .finally(() => chatDispatch({ type: SET_IS_LOADING, payload: false }));
  }

  const getDirectMessages = (payload) => {
    chatDispatch({ type: SET_IS_LOADING, payload: true })
    axiosInstance.get(`${chat_URL}/?receiever_id=${payload.id}`)
      .then((response) => {
        chatDispatch({ type: LOAD_CHAT, payload: response.data })
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
      .finally(() => chatDispatch({ type: SET_IS_LOADING, payload: false }));
  }

  const addNewMessage = ((payload) => {
    socketRef.current.emit(CHANNEL_NEW_CHAT_MESSAGE_EVENT, {
      content: payload,
      sender: {
        id: user.id,
        full_name: user.full_name,
        avatar: user.avatar
      }
    })
  })

  const addNewReaction = ((payload) => {
    const { message_id, reaction, user } = payload;
    socketRef.current.emit(CHANNEL_MESSAGE_NEW_REACTION_EVENT, {
      message_id: message_id,
      user,
      reaction
    })
  })

  const deleteReaction = ((payload) => {
    const { message_id, reaction, user } = payload;
    socketRef.current.emit(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, {
      message_id: message_id,
      user,
      reaction
    })
  })

  const editMessage = ((payload) => {
    const { message_id, new_content } = payload;
    socketRef.current.emit(CHANNEL_EDIT_MESSAGE_EVENT, {
      message_id,
      new_content
    })
  })

  const deleteMessage = ((payload) => {
    const { message_id } = payload;
    socketRef.current.emit(CHANNEL_DELETE_MESSAGE_EVENT, {
      message_id
    })
  })

  return <ChatContext.Provider
    value={
      {
        chatState,
        chatActions: {
          selectChannel,
          selectReceiver,
          getChannelChat,
          getDirectMessages,
          addNewMessage,
          addNewReaction,
          deleteReaction,
          editMessage,
          deleteMessage
        }
      }
    }
  >
  { children }
  </ChatContext.Provider>
}

export const useChatContext = () => useContext(ChatContext);