import React from 'react'
import { Layout, Affix } from 'antd';
import { useNavigate } from 'react-router';
import MenuCustom from '../MenuCustom/MenuCustom';
import NavHeader from '../NavHeader/NavHeader';
import {
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet } from 'react-router';
import  DirectMessagesSearch from './DirectMessagesSearch';

const { Sider, Content } = Layout;

const Navigation = () => {
  let navigate = useNavigate();

  const siderOptions = [
    {
      icon: <TeamOutlined />,
      name: 'Classrooms',
      id: 'Classrooms',
      onClick: (() => navigate('/classrooms'))
    }
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