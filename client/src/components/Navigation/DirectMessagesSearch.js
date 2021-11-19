import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUsersContext } from "../../contexts/UsersContext";
import { useAuthContext } from "../../contexts/AuthContext";
import UserDisplay from '../UserDisplay/UserDisplay';
import { Menu, Input, Spin } from 'antd';
import {
  MessageOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;
const DirectMessagesSearch = () => {
  const { authState: { user: current_user } } = useAuthContext();
  const { usersState: { users, isLoading }, usersActions: { getListOfUsers } } = useUsersContext();
  const [val, setVal] = useState('');
  const [options, setOptions] = useState([]);

  const handleChange = (e) => setVal(e.target.value);

  useEffect(() => {
    getListOfUsers();
  }, [])

  useEffect(() => {
    if (val)
      setOptions(users.filter((user) =>
        user.id.includes(val) ||
        user.full_name.toLowerCase().includes(val.toLowerCase()) ||
        (user.id === current_user.id && 'you'.includes(val.toLowerCase()))
      ))
    else setOptions(users)
  }, [val, users])

  return <Menu theme="dark" mode={"inline"} defaultOpenKeys={['Direct Messages']}>
    <SubMenu title="Direct Messages" icon={<MessageOutlined />} key="Direct Messages">
      <Input placeholder="Find or start a conversation"
        style={{ padding: "5% 10% 5% 10%", color: '#fff' }}
        bordered={false}
        value={val}
        onChange={handleChange}
        suffix={<SearchOutlined />}
      />
      <div style={{ height: "58vh", overflowY: "scroll" }}>
        {
          isLoading ? <Spin tip="Loading..." className="spinner" />
            : options.map((option) => {
              return <UserDisplay
                user={option}
                key={option.id}
                title={<Link to={`direct-messages/${option.id}`}
                style={{ color: '#1890ff' }}>
                  {option.id === current_user.id ? "You" : option.full_name}
                </Link>}
              />
            })
        }
      </div>
    </SubMenu>
  </Menu>
}

export default DirectMessagesSearch;