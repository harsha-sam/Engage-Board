import React, {
  useEffect,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "./AuthContext.jsx";
import { chatReducer, chatInitialState } from "./reducers/chatReducer";
import {
  LOAD_CHAT,
  SET_CHANNEL,
  SET_RECEIVER,
  ADD_MESSAGE_TO_CHAT,
  ADD_REACTION_TO_MESSAGE,
  REMOVE_REACTION_TO_MESSAGE,
  EDIT_MESSAGE,
  DELETE_MESSAGE,
  SET_IS_LOADING
} from "./actionTypes.js";
import {
  CHANNEL_NEW_CHAT_MESSAGE_EVENT,
  CHANNEL_EDIT_MESSAGE_EVENT,
  CHANNEL_DELETE_MESSAGE_EVENT,
  CHANNEL_MESSAGE_NEW_REACTION_EVENT,
  CHANNEL_MESSAGE_DELETE_REACTION_EVENT,
  NEW_CHAT_MESSAGE_EVENT,
  EDIT_MESSAGE_EVENT,
  DELETE_MESSAGE_EVENT,
  MESSAGE_NEW_REACTION_EVENT,
  MESSAGE_DELETE_REACTION_EVENT,
} from "./socketevents";
import { axiosInstance, chat_URL, channels_chat_URL } from "../api-config";
import { message } from "antd";
import { io } from "socket.io-client";

const ChatContext = React.createContext();

export const ChatProvider = ({ children }) => {
  const {
    authState: { user },
  } = useAuthContext();
  const [chatState, chatDispatch] = useReducer(chatReducer, chatInitialState);
  const receieverId = useMemo(
    () => chatState.receiver?.id,
    [chatState.receiver?.id]
  );
  const socketRef = useRef();
  let navigate = useNavigate();

  const selectChannel = useCallback((payload) => {
    // selecting channel for chatbox
    chatDispatch({ type: SET_IS_LOADING, payload: true });
    chatDispatch({ type: SET_CHANNEL, payload: payload });
  }, []);

  const selectReceiver = useCallback((payload) => {
    // selecting receiever of direct messages
    chatDispatch({ type: SET_IS_LOADING, payload: true });
    chatDispatch({ type: SET_RECEIVER, payload: payload });
  }, []);

  const initiateSocketConnection = (obj) => {
    // initializing socket connection
    socketRef.current = io(process.env.REACT_APP_API_BASE_URL, {
      query: obj,
    });
    console.log(`Connecting socket...`);
  };

  const setupSocketListener = useCallback(() => {
    // channel events
    socketRef.current.on(CHANNEL_NEW_CHAT_MESSAGE_EVENT, (message) => {
      chatDispatch({ type: ADD_MESSAGE_TO_CHAT, payload: message });
    });
    socketRef.current.on(CHANNEL_MESSAGE_NEW_REACTION_EVENT, (payload) => {
      chatDispatch({ type: SET_IS_LOADING, payload: true });
      chatDispatch({ type: ADD_REACTION_TO_MESSAGE, payload });
    });
    socketRef.current.on(CHANNEL_MESSAGE_DELETE_REACTION_EVENT, (payload) => {
      chatDispatch({ type: SET_IS_LOADING, payload: true });
      chatDispatch({ type: REMOVE_REACTION_TO_MESSAGE, payload });
    });
    socketRef.current.on(CHANNEL_EDIT_MESSAGE_EVENT, (payload) => {
      chatDispatch({ type: EDIT_MESSAGE, payload });
    });
    socketRef.current.on(CHANNEL_DELETE_MESSAGE_EVENT, (payload) => {
      if (payload.profanity_delete && payload.sender_id === user.id) {
        message.error(
          "Your message has been identified as profanity and removed"
        );
      }
      chatDispatch({ type: DELETE_MESSAGE, payload });
    });
    // Direct message events
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      chatDispatch({ type: ADD_MESSAGE_TO_CHAT, payload: message });
    });
    socketRef.current.on(MESSAGE_NEW_REACTION_EVENT, (payload) => {
      chatDispatch({ type: SET_IS_LOADING, payload: true });
      chatDispatch({ type: ADD_REACTION_TO_MESSAGE, payload });
    });
    socketRef.current.on(MESSAGE_DELETE_REACTION_EVENT, (payload) => {
      chatDispatch({ type: SET_IS_LOADING, payload: true });
      chatDispatch({ type: REMOVE_REACTION_TO_MESSAGE, payload });
    });
    socketRef.current.on(EDIT_MESSAGE_EVENT, (payload) => {
      chatDispatch({ type: EDIT_MESSAGE, payload });
    });
    socketRef.current.on(DELETE_MESSAGE_EVENT, (payload) => {
      chatDispatch({ type: DELETE_MESSAGE, payload });
    });
  }, [user.id]);

  const disconnectSocket = () => {
    // disconnecting socket
    console.log("Disconnecting socket...");
    if (socketRef.current) socketRef.current.disconnect();
  };

  const getChannelChat = useCallback((payload) => {
    // fetches messages of a channel in a classroom
    chatDispatch({ type: SET_IS_LOADING, payload: true });
    axiosInstance
      .get(`${channels_chat_URL}/${payload.id}`)
      .then((response) => {
        chatDispatch({ type: LOAD_CHAT, payload: response.data });
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || "something went wrong");
      })
      .finally(() => chatDispatch({ type: SET_IS_LOADING, payload: false }));
  }, []);

  useEffect(() => {
    if (chatState.channel && chatState.channel.id) {
      initiateSocketConnection({ channel_id: chatState.channel.id });
      setupSocketListener();
      getChannelChat(chatState.channel);
    }
    return () => disconnectSocket();
  }, [chatState.channel, setupSocketListener, getChannelChat]);

  const getDirectMessages = useCallback((payload) => {
    // fetches messages b/w user and receiver
    chatDispatch({ type: SET_IS_LOADING, payload: true });
    axiosInstance
      .get(`${chat_URL}/?receiver_id=${payload.id}`)
      .then((response) => {
        chatDispatch({
          type: SET_RECEIVER,
          payload: response.data.receiver,
        });
        chatDispatch({ type: LOAD_CHAT, payload: response.data.messages });
      })
      .catch((err) => {
        if (
          err?.response?.status === 400 &&
          err?.response?.data?.error === "user not found"
        ) {
          navigate("/error", {
            state: {
              title: "User not found",
              subTitle: `Sorry, the user does not exist. If the user recently registered.
              Please go back to home and refresh`,
            },
          });
        }
        message.error(err?.response?.data?.error || "something went wrong");
      })
      .finally(() => chatDispatch({ type: SET_IS_LOADING, payload: false }));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (receieverId) {
      initiateSocketConnection({
        sender_id: user.id,
        receiver_id: receieverId,
      });
      setupSocketListener();
      getDirectMessages({ id: receieverId });
    }
    return () => disconnectSocket();
  }, [receieverId, setupSocketListener, user.id, getDirectMessages]);

  const addNewMessage = (payload) => {
    // creates new message
    let msg = {
      content: payload,
      sender: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
      },
      receiver: chatState.receiver,
    };
    if (chatState.channel) {
      socketRef.current.emit(CHANNEL_NEW_CHAT_MESSAGE_EVENT, msg);
    } else if (chatState.receiver) {
      socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, msg);
    }
  };

  // create a new reaction
  const addNewReaction = (payload) => {
    const { message_id, reaction, user } = payload;
    let event = MESSAGE_NEW_REACTION_EVENT;
    // if channel exists, then the message belongs to a channel else it is a direct message event
    if (chatState.channel) event = CHANNEL_MESSAGE_NEW_REACTION_EVENT;
    socketRef.current.emit(event, {
      message_id: message_id,
      user,
      reaction,
    });
  };

  // deletes a reaction
  const deleteReaction = (payload) => {
    const { message_id, reaction, user } = payload;
    let event = MESSAGE_DELETE_REACTION_EVENT;
    if (chatState.channel) event = CHANNEL_MESSAGE_DELETE_REACTION_EVENT;
    socketRef.current.emit(event, {
      message_id: message_id,
      user,
      reaction,
    });
  };

  // edits a message
  const editMessage = (payload) => {
    const { message_id, new_content } = payload;
    let event = EDIT_MESSAGE_EVENT;
    if (chatState.channel) event = CHANNEL_EDIT_MESSAGE_EVENT;
    socketRef.current.emit(event, {
      message_id,
      new_content,
    });
  };

  // deletes a message
  const deleteMessage = (payload) => {
    const { message_id } = payload;
    let event = DELETE_MESSAGE_EVENT;
    if (chatState.channel) event = CHANNEL_DELETE_MESSAGE_EVENT;
    socketRef.current.emit(event, {
      message_id,
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chatState,
        chatActions: {
          selectChannel,
          selectReceiver,
          getChannelChat,
          getDirectMessages,
          addNewMessage,
          editMessage,
          deleteMessage,
          addNewReaction,
          deleteReaction,
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
