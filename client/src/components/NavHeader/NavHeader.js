import React from 'react'
import { useNavigate } from 'react-router';
import { useAuthContext } from '../../contexts/AuthContext';
import MenuCustom from '../MenuCustom/MenuCustom';
import { Layout, Avatar, Popover, Divider, Typography } from 'antd';
import {
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons';
import accessibility from '../../assets/accessibility.svg';

const { Header } = Layout;
const { Title, Text } = Typography;
const NavHeader = () => {
  let navigate = useNavigate();
  const { authState: { user, dyslexiaFontToggled }, authActions: { signout, toggleDyslexiaFont } } = useAuthContext()
  let color = "blue"
  if ('faculty' === user.role) {
    color = "red";
  }
  else if (user.role === 'monitor') {
    color = "green"
  }
  const content = (
    <>
      <Title level={4}>Accessibilty</Title>
      <Divider />
      <Text>
        If you have difficulty reading try using a font for dyslexia.
      </Text>
    </>
  );
  const headerOptions = [
    {
      icon: <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }}>
        {user.full_name[0]}
      </Avatar>,
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
    {
      icon:
        <Popover trigger="hover" content={content}>
          <Avatar src={accessibility} style={{ backgroundColor: '#A0AEC0' }} />
        </Popover>,
      id: "Accessibilty",
      onClick: toggleDyslexiaFont,
    }
  ]

  return <Header>
    <MenuCustom items={headerOptions} mode="horizontal"
      selectedKeys={dyslexiaFontToggled ? ['Accessibilty'] : []}
    />
  </Header>
}

export default NavHeader
