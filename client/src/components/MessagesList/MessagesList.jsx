import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import Message from "../Message/Message.jsx";
import EmptyCustom from "../EmptyCustom/EmptyCustom.jsx";
import { Button, Divider, Typography, Skeleton, Popconfirm } from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";
import { CustomAvatar } from "../UserDisplay/UserDisplay.jsx";

const { Paragraph, Title } = Typography;
// Chat area component - same for classrooms and direct messages
const MessagesList = ({ wrapperClassName, permittedToMessage }) => {
  const {
    authState: { user },
  } = useAuthContext();
  const {
    chatState: { isLoading, messagesList },
    chatActions: { addNewMessage, editMessage, deleteMessage },
  } = useChatContext();
  const [newMessage, setNewMessage] = useState("");
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

  const handleSendMessage = () => {
    if (newMessage) {
      // if newMessage is not empty string, message is sent
      addNewMessage(newMessage);
    }
    setNewMessage("");
  };

  const handleEditMessage = (msg_id, content) => {
    // if content is not empty, message is updated
    if (content) editMessage({ message_id: msg_id, new_content: content });
  };

  const handleDeleteMessage = (msg_id) => {
    // message is deleted
    deleteMessage({ message_id: msg_id });
  };

  return (
    <>
      <div className={wrapperClassName} ref={messagesListRef}>
        {isLoading && <DummyMessages />}
        {!isLoading && messagesList.length === 0 ? (
          <EmptyCustom description="No messages found" />
        ) : (
          messagesList.map((msg) => {
            let author = msg.sender.full_name;
            let avatar = <CustomAvatar user={msg.sender} />;
            // if the message belongs to the current user
            if (msg.sender.id === user.id) {
              author = "You";
              avatar = (
                <>
                  <Divider
                    type="vertical"
                    style={{
                      borderColor: "#1890ff",
                      height: "50%",
                    }}
                  />
                  {avatar}
                </>
              );
            }
            return (
              <Message
                key={msg.id}
                messageId={msg.id}
                author={author}
                authorId={msg.sender.id}
                avatar={avatar}
                content={
                  <Paragraph
                    editable={
                      // if the message belongs to current user, then the user can edit the message
                      msg.sender.id === user.id
                        ? {
                            onChange: (val) => handleEditMessage(msg.id, val),
                          }
                        : false
                    }
                    ellipsis={{
                      rows: 2,
                      expandable: true,
                      symbol: "see more",
                    }}
                    // if the message belongs to current user, then the user can delete the message
                    // manipulating copyable property of Paragraph component from antd for deleting feature
                    copyable={
                      msg.sender.id === user.id
                        ? {
                            icon: [
                              <Popconfirm
                                title="Are you sure to delete this message?"
                                onConfirm={() => handleDeleteMessage(msg.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined />
                              </Popconfirm>,
                              <Popconfirm
                                title="Are you sure to delete this message?"
                                onConfirm={() => handleDeleteMessage(msg.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined />
                              </Popconfirm>,
                            ],
                            tooltips: ["Delete", "Delete"],
                            onCopy: () => {},
                          }
                        : false
                    }
                  >
                    {msg.content}
                  </Paragraph>
                }
                time={moment(msg.createdAt)}
                reactions={msg.reactions}
              />
            );
          })
        )}
      </div>
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
              onClick={handleSendMessage}
            />
          </>
        )}
        {!permittedToMessage && (
          <Title level={5} type="secondary">
            You do not have permission to send messages in this channel.
          </Title>
        )}
      </div>
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
