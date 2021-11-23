import React, { useEffect, useRef } from "react";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import EmptyCustom from "../EmptyCustom/EmptyCustom.jsx";
import Message from "../Message/Message.jsx";
import InputMessage from "./InputMessage.jsx";
import { Skeleton } from "antd";

// Chat area component - same for classrooms and direct messages
const MessagesList = ({ wrapperClassName, permittedToMessage }) => {
  const {
    chatState: { isLoading, messagesList },
  } = useChatContext();
  // references the chat box component
  const messagesListRef = useRef(null);

  const scrollToBottom = () => {
    const scroll =
      messagesListRef.current.scrollHeight -
      messagesListRef.current.clientHeight;
    messagesListRef.current.scrollTo(0, scroll);
  };

  useEffect(() => {
    // always the chat box should be scrolled to bottom whenever new message is received
    scrollToBottom();
  }, [messagesList.length]);

  return (
    <>
      <div className={wrapperClassName} ref={messagesListRef}>
        {isLoading && <DummyMessages />}
        {!isLoading && messagesList.length === 0 ? (
          <EmptyCustom description="No messages found" />
        ) : (
          messagesList.map((msg) => {
            return <Message key={msg.id} msg={msg} />;
          })
        )}
      </div>
      <InputMessage permittedToMessage={permittedToMessage} />
    </>
  );
};

export const DummyMessages = ({ length = 5 }) => {
  // skeleton messages
  let list = [];
  for (let i = 1; i <= length; i++) {
    list.push(`dum${i}`);
  }
  return (
    <>
      {list.map((ele) => {
        return (
          <Skeleton
            avatar
            key={ele}
            paragraph={{ rows: 2 }}
            className="message"
          />
        );
      })}
    </>
  );
};

export default MessagesList;
