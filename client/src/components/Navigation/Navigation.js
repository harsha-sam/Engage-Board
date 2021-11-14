import React from 'react'
import { Layout, Avatar, Affix } from 'antd';
import { useNavigate } from 'react-router';
import MenuCustom from '../../components/MenuCustom/MenuCustom';
import {
  TeamOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
  BookOutlined,
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
      onClick: (() => navigate('/classrooms'))
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
        <MenuCustom items={headerOptions} mode="horizontal" selectable={false}/>
      </Header>
      <Layout>
        <Sider collapsible width={240} style={{ height: '100vh' }}>
          <MenuCustom items={siderOptions} mode="inline"
            defaultSelectedKeys={['Classrooms']}
          />
        </Sider>
        <Content style={{ margin: '3% 5%', height: '100vh' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  </Affix>
}

export default Navigation;