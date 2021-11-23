import React, { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import UserDisplay, { CustomAvatar } from "../UserDisplay/UserDisplay.jsx";
import {
  Comment,
  Tooltip,
  Modal,
  Tabs,
  List,
  Divider,
  Popconfirm,
  Typography,
} from "antd";
import {
  LikeOutlined,
  LikeTwoTone,
  SmileOutlined,
  SmileTwoTone,
  FrownOutlined,
  FrownTwoTone,
  HeartOutlined,
  HeartTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import "./Message.css";

const { TabPane } = Tabs;

// reactions available for messages
const defaultReactions = [
  {
    key: "Like",
    title: "Like",
    count: 0,
    iconFilled: <LikeTwoTone />,
    iconOutlined: <LikeOutlined />,
  },
  {
    key: "Smile",
    title: "Smile",
    count: 0,
    iconFilled: <SmileTwoTone />,
    iconOutlined: <SmileOutlined />,
  },
  {
    key: "Frown",
    title: "Frown",
    count: 0,
    iconFilled: <FrownTwoTone />,
    iconOutlined: <FrownOutlined />,
  },
  {
    key: "Heart",
    title: "Heart",
    count: 0,
    iconFilled: <HeartTwoTone />,
    iconOutlined: <HeartOutlined />,
  },
];

const { Paragraph } = Typography;

const Message = ({ msg }) => {
  const {
    authState: { user },
  } = useAuthContext();
  const {
    chatState: { isLoading, channel },
    chatActions: { editMessage, deleteMessage, addNewReaction, deleteReaction },
  } = useChatContext();
  const {
    classroomState: { members },
  } = useClassroomContext();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleEditMessage = (msg_id, content) => {
    // if content is not empty, message is updated
    if (content && content !== msg.content)
      editMessage({
        message_id: msg_id,
        new_content: content,
      });
  };

  const handleDeleteMessage = (msg_id) => {
    // message is deleted
    deleteMessage({ message_id: msg_id });
  };

  const handleReactionClick = (reaction) => {
    let payload = {
      message_id: msg.id,
      reaction: reaction.key,
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
      },
    };
    // if the user already did that specific reaction, we need to undo it
    if (reaction.users && reaction.users.some((u) => u.id === user.id)) {
      deleteReaction(payload);
    } else {
      // new reaction
      addNewReaction(payload);
    }
  };

  const { id, content, sender, reactions, createdAt, updatedAt } = msg;

  let author = sender.full_name;
  if (channel) {
    sender.role = members[sender.id]?.role;
  }
  let avatar = <CustomAvatar user={sender} />;
  // if the message belongs to the current user
  if (sender.id === user.id) {
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
  //if created time not equal to updated time then the message is edited
  let time = moment(createdAt);
  let edited = createdAt !== updatedAt;
  if (edited) {
    time = moment(updatedAt);
  }

  // counting available reactions for this message and displaying
  let actions = defaultReactions.map((reaction) => {
    let currentReaction = null;
    currentReaction = reactions.find((element) => element.key === reaction.key);
    if (currentReaction) reaction = { ...reaction, ...currentReaction };
    return (
      <Tooltip key={reaction.key} title={reaction.title}>
        <span onClick={() => handleReactionClick(reaction)}>
          {reaction.count > 0 ? reaction.iconFilled : reaction.iconOutlined}
          <span className="message-reactions">{reaction.count}</span>
        </span>
      </Tooltip>
    );
  });

  // if any reaction count is greater than 0, users list of who reacted will be rendered
  if (reactions.some((reaction) => reaction.count > 0)) {
    actions.push(<span onClick={showModal}>See Who Reacted</span>);
  }

  return (
    <>
      <Comment
        className="message"
        actions={isLoading ? <></> : actions}
        author={<Link to={`/direct-messages/${sender.id}`}>{author}</Link>}
        avatar={avatar}
        datetime={
          <Tooltip title={moment(time).format("YYYY-MM-DD HH:mm:ss")}>
            <span>
              {edited
                ? `Edited ${moment(time).fromNow()}`
                : moment(time).fromNow()}
            </span>
          </Tooltip>
        }
        content={
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: "see more",
            }}
            editable={
              // if the message belongs to current user, then the user can edit the message
              sender.id === user.id
                ? {
                    onChange: (val) => handleEditMessage(id, val),
                  }
                : false
            }
            // if the message belongs to current user, then the user can delete the message
            // manipulating copyable property of Paragraph component from antd for deleting feature
            copyable={
              sender.id === user.id
                ? {
                    icon: [
                      <Popconfirm
                        title="Are you sure to delete this message?"
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>,
                      <Popconfirm
                        title="Are you sure to delete this message?"
                        onConfirm={() => handleDeleteMessage(id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>,
                    ],
                    tooltips: ["Delete", "Delete"],
                  }
                : false
            }
          >
            {content}
          </Paragraph>
        }
      />
      {
        <Modal
          title=""
          closable={false}
          visible={isModalVisible && !isLoading}
          onCancel={handleCancel}
          footer={null}
        >
          {/* showing reactions tabs and the users list who reacted */}
          <Tabs centered>
            {reactions.map((reaction) => (
              <TabPane tab={reaction.key} key={reaction.key}>
                {reaction.users.length > 0 ? (
                  <List
                    dataSource={reaction.users}
                    renderItem={(item) => {
                      if (channel) {
                        item.role = members[item.id]?.role;
                      }
                      return (
                        <UserDisplay
                          key={item.id}
                          user={item}
                          showTag={false}
                        />
                      );
                    }}
                  />
                ) : (
                  <span>No reactions</span>
                )}
              </TabPane>
            ))}
          </Tabs>
        </Modal>
      }
    </>
  );
};

export default Message;
