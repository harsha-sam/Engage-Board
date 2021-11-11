import React from 'react'
import { Layout, Avatar, Affix } from 'antd';
import MenuCustom from '../../components/MenuCustom/MenuCustom';
import {
  TeamOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useAuthContext } from '../../contexts/AuthContext';

const { Sider, Header, Content } = Layout;
const siderOptions = [
  {
    icon: <TeamOutlined />,
    name: 'Teams',
    id: 'Teams'
  },
  {
    icon: <MessageOutlined />,
    name: 'Chat',
    id: 'Chat'
  },
  {
    icon: <BookOutlined />,
    name: 'Notes',
    id: 'Notes'
  },
]

const Navigation = ({ children }) => {
  const {authState: {user}, authActions: {signout}} = useAuthContext()

  const headerOptions = [
    {
      icon: <Avatar src={<UserOutlined />}
      />,
      name: 'User',
      id: 'User',
      channels: [
        {
          icon: <EditOutlined />,
          name: "Change Avatar",
          id: 'Avatar',
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

  return <Affix>
    <Layout>
      <Header>
        <MenuCustom items={headerOptions} mode="horizontal" />
      </Header>
      <Layout>
        <Sider collapsible style={{ height: '100vh' }}>
          <MenuCustom items={siderOptions} mode="inline"/>
        </Sider>
        <Content style={{margin: '3% 5%', height: '100vh'}}>
          {children}
        </Content>
      </Layout>
    </Layout>
  </Affix>
}

export default Navigation;