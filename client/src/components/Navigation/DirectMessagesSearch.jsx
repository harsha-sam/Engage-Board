import React, { useState, useEffect } from "react";
import { useUsersContext } from "../../contexts/UsersContext.jsx";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import UserDisplay from "../UserDisplay/UserDisplay.jsx";
import { Menu, Input, Spin, Divider } from "antd";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;
const DirectMessagesSearch = () => {
  const {
    authState: { user: current_user },
  } = useAuthContext();
  const {
    usersState: { users, isLoading },
    usersActions: { getListOfUsers },
  } = useUsersContext();
  const [val, setVal] = useState("");
  const [options, setOptions] = useState([]);

  const handleChange = (e) => setVal(e.target.value);

  useEffect(() => {
    // getting list of users on mount
    getListOfUsers();
  }, [getListOfUsers]);

  useEffect(() => {
    // on search filter list of users
    setOptions(
      users.filter(
        (user) =>
          // filter based on user's name or id
          user.id.toLowerCase().includes(val.toLowerCase()) ||
          user.full_name.toLowerCase().includes(val.toLowerCase()) ||
          (user.id === current_user.id && "you".includes(val.toLowerCase()))
      )
    );
  }, [val, users, current_user.id]);

  return (
    <Menu theme="dark" mode={"inline"} defaultOpenKeys={["Direct Messages"]}>
      <SubMenu
        title="Direct Messages"
        icon={<MessageOutlined />}
        key="Direct Messages"
      >
        {/* search for users */}
        <Input
          placeholder="Find or start a conversation"
          style={{ padding: "5% 10% 5% 10%", color: "#fff" }}
          bordered={false}
          value={val}
          onChange={handleChange}
          suffix={<SearchOutlined />}
        />
        <div style={{ height: "50vh", overflowY: "scroll" }}>
          {isLoading ? (
            // if list of users is loading. Show loader
            <Spin tip="Loading..." className="spinner" />
          ) : (
            options.map((option) => {
              if (option.id === current_user.id) {
                option.full_name = "You";
              }
              return <UserDisplay user={option} key={option.id} />;
            })
          )}
        </div>
        <Divider className="divider" />
      </SubMenu>
    </Menu>
  );
};

export default DirectMessagesSearch;
