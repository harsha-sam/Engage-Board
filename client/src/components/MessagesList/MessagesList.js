import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment';
import { Avatar, Button, Divider, Typography, Skeleton, Popconfirm } from 'antd';
import Message from '../Message/Message';
import { useAuthContext } from '../../contexts/AuthContext';
import { useChatContext } from '../../contexts/ChatContext';
import InputEmoji from 'react-input-emoji'
import { SendOutlined, DeleteOutlined } from '@ant-design/icons'
import EmptyCustom from '../EmptyCustom/EmptyCustom';

const { Paragraph } = Typography;
const MessagesList = () => {
  let { authState: { user } } = useAuthContext();
  const { chatState: { isLoading, messagesList },
    chatActions: { addNewMessage, editMessage, deleteMessage } } = useChatContext();
  const [newMessage, setNewMessage] = useState('');
  const messagesListRef = useRef(null);

  const scrollToBottom = () => {
    const scroll =
      messagesListRef.current.scrollHeight -
      messagesListRef.current.clientHeight;
    messagesListRef.current.scrollTo(0, scroll);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messagesList.length])

  const handleSendMessage = () => {
    if (newMessage) {
      addNewMessage(newMessage);
    }
    setNewMessage("");
  };

  const handleEditMessage = (msg_id, content) => {
    editMessage({ message_id: msg_id, new_content: content })
  }

  const handleDeleteMessage = (msg_id) => {
    deleteMessage({ message_id: msg_id })
  }

  return <>
    <div className="messages-list" ref={messagesListRef}>
      {
        isLoading && <DummyMessages />
      }
      {
        !isLoading && messagesList.length === 0 ?
          <EmptyCustom description="No messages found in this channel" />
          :
          messagesList.map((msg) => {
            let author = msg.sender.full_name
            let avatar = <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
            if (msg.sender.id === user.id) {
              author = 'You'
              avatar = <>
                <Divider
                  type="vertical"
                  style={{
                    borderColor: '#1890ff',
                    height: '50%'
                  }}
                />
                <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
              </>
            }
            return <Message
              key={msg.id}
              messageId={msg.id}
              author={author}
              avatar={avatar}
              content={
                <Paragraph
                  editable={msg.sender.id === user.id ? {
                    onChange: (val) => handleEditMessage(msg.id, val),
                  } : false}
                  ellipsis={{
                    rows: 2,
                    expandable: true,
                    symbol: "see more"
                  }}
                  copyable={msg.sender.id === user.id ? {
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
                      </Popconfirm>],
                    tooltips: ["Delete", "Delete"],
                    onCopy: () => { }
                  } : false}
                >
                  {msg.content}
                </Paragraph>
              }
              time={moment(msg.createdAt)}
              reactions={msg.reactions}
            />
          })
      }
    </div>
    {
      !isLoading &&
      <div className="chat-input-container">
        <InputEmoji
          value={newMessage}
          onChange={setNewMessage}
          onEnter={handleSendMessage}
          cleanOnEnter
          placeholder="Type a message"
        />
        <Button type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
        />
      </div>
    }
  </>
}


export const DummyMessages = ({ length = 5 }) => {
  let list = []
  for (let i = 1; i <= length; i++) {
    list.push(`dum${i}`)
  }
  return <>
    {
      list.map((ele) => {
        return <Skeleton avatar key={ele} paragraph={{ rows: 2 }} className="message" />
      })
    }
  </>
}

export default MessagesList
