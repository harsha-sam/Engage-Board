import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment';
import { List, Avatar, Button, Divider, Typography } from 'antd';
import Message from '../Message/Message';
import { useAuthContext } from '../../contexts/AuthContext';
import { useChatContext } from '../../contexts/ChatContext';
import InputEmoji from 'react-input-emoji'
import { SendOutlined } from '@ant-design/icons'

const { Paragraph } = Typography;
const MessagesList = () => {
  let { authState: { user } } = useAuthContext();
  const { chatState: { isLoading, messagesList }, chatActions: { addNewMessage } } = useChatContext();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    addNewMessage(newMessage);
    setNewMessage("");
  };

  return <>
    <List className="messages-list"
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={messagesList}
      renderItem={msg => {
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
              editable
              ellipsis={{
                rows: 2,
                expandable: true,
                symbol: "see more"
              }}
            >
              {msg.content}
            </Paragraph>
          }
          time={moment(msg.createdAt)}
          reactions={msg.reactions}
        />
      }}
    />
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

export default MessagesList
