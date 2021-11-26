import React, { useState } from "react";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import InputEmoji from "react-input-emoji";
import { Button, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Title } = Typography;
const InputMessage = ({ permittedToMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const {
    chatState: { isLoading },
    chatActions: { addNewMessage },
  } = useChatContext();

  const handleSendMessage = (newMessage) => {
    if (newMessage) {
      // if newMessage is not empty string, message is sent
      addNewMessage(newMessage);
    }
    setNewMessage("");
  };
  return (
    <div className="chat-input-container">
      {/* if user is permitted to send messages in this channel*/}
      {!isLoading && permittedToMessage && (
        <>
          <InputEmoji
            value={newMessage}
            onChange={setNewMessage}
            onEnter={handleSendMessage}
            cleanOnEnter
            placeholder="Type a message"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => {
              handleSendMessage(newMessage)
            }}
          />
        </>
      )}
      {!permittedToMessage && (
        <Title level={5} type="secondary">
          You do not have permission to send messages in this channel.
        </Title>
      )}
    </div>
  );
};

export default InputMessage;
