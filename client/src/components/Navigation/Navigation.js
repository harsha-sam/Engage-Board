import React from 'react'
import { Layout, Avatar, Affix, Input } from 'antd';
import { useNavigate } from 'react-router';
import MenuCustom from '../../components/MenuCustom/MenuCustom';
import {
  TeamOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
  BookOutlined,
  RocketOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../../contexts/AuthContext';

const { Sider, Header, Content } = Layout;

const Navigation = ({ children }) => {
  let navigate = useNavigate();
  const { authState: { user }, authActions: { signout } } = useAuthContext()

  const headerOptions = [
    {
      icon: <Avatar src={<UserOutlined />}
      />,
      name: user.full_name,
      id: user.id,
      channels: [
        {
          icon: <EditOutlined />,
          name: "Upload / Change Avatar",
          id: 'Avatar',
          onClick: (() => navigate('/avatar'))
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

  const siderOptions = [
    {
      icon: <TeamOutlined />,
      name: 'Classrooms',
      id: 'Classrooms',
      channels: [
        {
          icon: <RocketOutlined />,
          name: 'All Classrooms',
          id: 'All Classrooms',
          onClick: (() => navigate('/teams'))
        },
        {
          icon: <SettingOutlined />,
          name: 'Manage Classrooms',
          id: 'Manage Classrooms',
          onClick: (() => navigate('/manage-teams'))
        }
      ]
    },
    {
      icon: <MessageOutlined />,
      name: 'Direct Messages',
      id: 'Direct Messages',
      onClick: (() => navigate('/direct-messages'))
    },
    {
      icon: <BookOutlined />,
      name: 'Notes',
      id: 'Notes',
      onClick: (() => navigate('/notes'))
    },
  ]

  return <Affix>
    <Layout>
      <Header>
        <MenuCustom items={headerOptions} mode="horizontal" />
      </Header>
      <Layout>
        <Sider collapsible width={240} style={{ height: '100vh' }}>
          <MenuCustom items={siderOptions} mode="inline" defaultOpenKeys={['Classrooms']} />
        </Sider>
        <Content style={{ margin: '3% 5%', height: '100vh' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  </Affix>
}

export default Navigation;