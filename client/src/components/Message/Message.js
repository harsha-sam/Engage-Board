import React, { useState } from 'react'
import { Comment, Tooltip, Modal, Tabs, List, Avatar } from 'antd';
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

const { TabPane } = Tabs;

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  let actions = defaultReactions.map((reaction) => {
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

  if (reactions?.length) {
    actions.push(<span onClick={showModal}>See Who Reacted</span>)
  }

  return <>
    <Comment
      className="message"
      actions={isLoading ? <></> : actions}
      author={<a>{author}</a >}
      datetime={
        <Tooltip title={moment(time).format('YYYY-MM-DD HH:mm:ss')} >
          <span>{moment(time).fromNow()}</span>
        </Tooltip>
      }
      {...props}
    />
    {
      <Modal title="Reactions"
        visible={isModalVisible && !isLoading}
        onCancel={handleCancel}
        footer={null}
      >
        <Tabs defaultActiveKey="0" centered>
          {
            reactions.map((reaction, index) => {
              if (reaction.users) {
                return <TabPane tab={reaction.key} key={index}>
                  {
                    <List
                    dataSource={reaction.users}
                    renderItem={item => {
                      return <List.Item key={item.id}>
                        <List.Item.Meta
                          avatar={<Avatar src={"https://joeschmoe.io/api/v1/random"} />}
                          title={<a href="https://ant.design">{item.full_name}</a>}
                          description={item.id}
                        />
                      </List.Item>
                    }}
                    />
                  }
                </TabPane>   
              }
              else {
                return <>No data</>
              }
            })
          }
        </Tabs>
      </Modal>
    }
  </>
}

export default Message
