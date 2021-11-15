import React from 'react'
import { Layout, Affix } from 'antd';
import { useNavigate } from 'react-router';
import MenuCustom from '../MenuCustom/MenuCustom';
import NavHeader from '../NavHeader/NavHeader';
import {
  TeamOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const Navigation = ({ children }) => {
  let navigate = useNavigate();

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
  ]

  return <Affix>
    <Layout>
      <NavHeader />
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