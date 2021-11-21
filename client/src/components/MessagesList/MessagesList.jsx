import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import Message from "../Message/Message.jsx";
import EmptyCustom from "../EmptyCustom/EmptyCustom.jsx";
import {
  Button,
  Divider,
  Typography,
  Skeleton,
  Popconfirm,
} from "antd";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";
import { CustomAvatar } from "../UserDisplay/UserDisplay.jsx";

const { Paragraph, Title } = Typography;
const MessagesList = ({ wrapperClassName }) => {
  let {
    authState: { user },
  } = useAuthContext();
  const {
    chatState: { isLoading, messagesList, channel },
    chatActions: { addNewMessage, editMessage, deleteMessage },
  } = useChatContext();
  const [newMessage, setNewMessage] = useState("");
  const {
    classroomState: { members },
  } = useClassroomContext();
  const messagesListRef = useRef(null);

  const scrollToBottom = () => {
    const scroll =
      messagesListRef.current.scrollHeight -
      messagesListRef.current.clientHeight;
    messagesListRef.current.scrollTo(0, scroll);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesList.length]);

  const handleSendMessage = () => {
    if (newMessage) {
      addNewMessage(newMessage);
    }
    setNewMessage("");
  };

  const handleEditMessage = (msg_id, content) => {
    editMessage({ message_id: msg_id, new_content: content });
  };

  const handleDeleteMessage = (msg_id) => {
    deleteMessage({ message_id: msg_id });
  };

  const permitted = useMemo(() => {
    if (channel) {
      return channel.message_permission?.includes(members[user.id]?.role);
    }
    else {
      return true
    }
  }, [members, channel, user]);

  return (
    <>
      <div className={wrapperClassName} ref={messagesListRef}>
        {isLoading && <DummyMessages />}
        {!isLoading && messagesList.length === 0 ? (
          <EmptyCustom description="No messages found" />
        ) : (
          messagesList.map((msg) => {
            let author = msg.sender.full_name;
            let avatar = <CustomAvatar user={msg.sender} />
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
        {!isLoading && permitted && (
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
        {!permitted && (
          <Title level={5} type="secondary">
            You do not have permission to send messages in this channel.
          </Title>
        )}
      </div>
    </>
  );
};

export const DummyMessages = ({ length = 5 }) => {
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
