import React from 'react'
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';
import MenuCustom from '../MenuCustom/MenuCustom';
import { Layout, Avatar } from 'antd';
import {
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const NavHeader = () => {
  let navigate = useNavigate();
  const { authState: { user }, authActions: { signout } } = useAuthContext()
  let color = "blue"
  if ('faculty' === user.role) {
    color = "red";
  }
  else if (user.role === 'monitor') {
    color = "green"
  }
  const headerOptions = [
    {
      icon: <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }}>{ user.full_name[0] }</Avatar>,
      name: user.full_name,
      id: user.id,
      channels: [
        {
          icon: <EditOutlined />,
          name: "Update User Profile",
          id: 'user profile',
          onClick: (() => navigate('/profile'))
        },
        {
          icon: <LogoutOutlined />,
          name: "Logout",
          id: "Logout",
          onClick: signout
        }
      ]
    },
  ]

  return <Header>
    <MenuCustom items={headerOptions} mode="horizontal" selectable={false} />
  </Header>
}

export default NavHeader
