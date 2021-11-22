import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useUsersContext } from "../../contexts/UsersContext.jsx";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import MessagesList from "../../components/MessagesList/MessagesList.jsx";
import { Breadcrumb, Spin } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

// private messaging component
const DirectMessages = () => {
  const { id } = useParams();
  const {
    authState: { user },
  } = useAuthContext();
  const {
    chatState: { receiver },
    chatActions: { selectReceiver },
  } = useChatContext();
  const {
    usersState: { isLoading: usersLoading },
  } = useUsersContext();

  useEffect(() => {
    // fetching the user based on the current route id /direct-messages/:id
    selectReceiver({ id });
  }, [id, selectReceiver]);

  if (usersLoading) {
    // if list of users is loading
    return <Spin tip="Loading..." className="spinner" />;
  }

  return (
    <>
      <Breadcrumb className="bread-crumb">
        <Breadcrumb.Item>
          <Link to={"/"}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {/* if the user is current user itself, then You will be shown*/}
          {receiver?.id === user?.id ? "You" : receiver?.full_name}
        </Breadcrumb.Item>
      </Breadcrumb>
      {/* messages list will auto fetch the chat based on the chat context*/}
      <MessagesList
        wrapperClassName="direct-messages"
        // permittedToMessage will be true incase of direct messages.
        permittedToMessage={true}
      />
    </>
  );
};

export default DirectMessages;
