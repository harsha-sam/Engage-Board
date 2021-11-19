import React from 'react'
import { Outlet } from 'react-router';
import { Layout, Affix } from 'antd';
import { useNavigate } from 'react-router';
import MenuCustom from '../MenuCustom/MenuCustom';
import NavHeader from '../NavHeader/NavHeader';
import DirectMessagesSearch from './DirectMessagesSearch';
import {
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const Navigation = () => {
  let navigate = useNavigate();

  const siderOptions = [
    {
      icon: <TeamOutlined />,
      name: 'Classrooms',
      id: 'Classrooms',
      onClick: (() => navigate('/classrooms'))
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
      <NavHeader />
      <Layout>
        <Sider collapsible width={260} style={{ height: '100vh' }}>
          <MenuCustom items={siderOptions} mode="inline" selectable={false}/>
          <DirectMessagesSearch />
        </Sider>
        <Content style={{ height: '100vh' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  </Affix>
}

export default Navigation;