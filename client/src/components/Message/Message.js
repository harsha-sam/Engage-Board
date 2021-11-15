import React from 'react'
import { Comment, Tooltip } from 'antd';
import {
  LikeOutlined,
  LikeTwoTone,
  SmileOutlined,
  SmileTwoTone,
  FrownOutlined,
  FrownTwoTone,
  HeartOutlined,
  HeartTwoTone,
} from '@ant-design/icons';
import moment from 'moment';
import './Message.css'
import { useChatContext } from '../../contexts/ChatContext';
import { useAuthContext } from '../../contexts/AuthContext';


const defaultReactions = [
  {
    key: 'Like',
    title: 'Like',
    count: 0,
    iconFilled: <LikeTwoTone />,
    iconOutlined: <LikeOutlined />
  },
  {
    key: 'Smile',
    title: 'Smile',
    count: 0,
    iconFilled: <SmileTwoTone />,
    iconOutlined: <SmileOutlined />
  },
  {
    key: 'Frown',
    title: 'Frown',
    count: 0,
    iconFilled: <FrownTwoTone />,
    iconOutlined: <FrownOutlined />
  },
  {
    key: 'Heart',
    title: 'Heart',
    count: 0,
    iconFilled: <HeartTwoTone />,
    iconOutlined: <HeartOutlined />
  },
]

const Message = ({ author, time, reactions, messageId, ...props }) => {
  const { authState: { user } } = useAuthContext();
  const { chatState: { isLoading }, chatActions: { addNewReaction, deleteReaction } } = useChatContext();
  
  const handleReactionClick = (reaction) => {
    let payload = {
      message_id: messageId, reaction: reaction.key,
      user: {
        id: user.id,
        full_name: user.full_name,
        avatar: user.avatar
      }
    }
    if (reaction.users && reaction.users.some((u) => u.id === user.id)) {
      deleteReaction(payload);
    }
    else {
      addNewReaction(payload);
    }
  }

  const actions = defaultReactions.map((reaction) => {
    let currentReaction = null;
    currentReaction = reactions.find(element => element.key === reaction.key)
    if (currentReaction) reaction = { ...reaction, ...currentReaction }
    return <Tooltip key={reaction.key} title={reaction.title}>
      <span onClick={() => handleReactionClick(reaction)}>
        {reaction.count > 0 ? reaction.iconFilled : reaction.iconOutlined}
        <span className="message-reactions">{reaction.count}</span>
      </span>
    </Tooltip>
  })

  console.log("rendering", reactions, isLoading);
  return <Comment
    className="message"
    actions={isLoading ? <></>: actions}
    author={<a>{author}</a >}
    datetime={
      <Tooltip title={moment(time).format('YYYY-MM-DD HH:mm:ss')} >
        <span>{moment(time).fromNow()}</span>
      </Tooltip>
    }
    {...props}
  />
}

export default Message
