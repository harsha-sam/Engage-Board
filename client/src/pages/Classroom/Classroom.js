import React, { useState, useEffect } from 'react'
import { Affix, Layout, List, Avatar, Tag, Typography, Spin } from 'antd';
import MessagesList from '../../components/MessagesList/MessagesList';
import MenuCustom from '../../components/MenuCustom/MenuCustom';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { useChatContext } from '../../contexts/ChatContext';
import { useParams } from 'react-router';
import NavHeader from '../../components/NavHeader/NavHeader';
import ClassroomSidebarHeader from '../../components/ClassroomSidebarHeader/ClassroomSidebarHeader';
import { UsersProvider } from '../../contexts/UsersContext';

const { Sider, Content } = Layout;

const { Paragraph } = Typography;
const Classroom = () => {
  const { classroomState, classroomActions: { getClassroom } } = useClassroomContext();
  const { chatState: { channel }, chatActions: { selectChannel } } = useChatContext();
  const { id } = useParams();
  const {
    description,
    members,
    categories,
  } = classroomState;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    getClassroom({ id });
  }, [id])

  useEffect(() => {
    if (classroomState.categories) {
      for (let cat of categories) {
        if (cat.channels.length) {
          selectChannel({ id: cat.channels[0].id })
          break
        }
      }
      setIsLoading(false)
    }
  }, [classroomState.categories])

  if (isLoading) {
    return <Spin tip="Loading..." className="spinner" />
  }

  return <Affix>
    <Layout>
      <Sider theme="dark" style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
      }}>
        <UsersProvider>
          <ClassroomSidebarHeader />
        </UsersProvider>
        <MenuCustom items={categories}
          mode={'inline'}
          onClick={({ key }) => selectChannel({ id: key })}
          selectedKeys={[channel.id]}
          defaultOpenKeys={categories.map((category) => category.id)}
        />
      </Sider>
      <Content>
        <Layout>
          <Content>
            <Layout>
              <NavHeader />
              <MessagesList />
            </Layout>
          </Content>
          <Sider theme="dark"
            style={{ height: '100vh', padding: '2% 3%' }}>
            <Paragraph
              style={{ color: '#fff' }}
              ellipsis={{
                rows: 4,
                expandable: true,
                symbol: "see more"
              }}
            >
              {description}
            </Paragraph>
            <List>
              {
                members.map((member) => {
                  return <List.Item key={member.id}>
                    <List.Item.Meta
                      style={{ color: '#fff' }}
                      avatar={<Avatar src={"https://joeschmoe.io/api/v1/random"} />}
                      title={<a href="https://ant.design">{member.full_name}</a>}
                      description={<Tag color="green">{member.role}</Tag>}
                    />
                  </List.Item>
                })
              }
            </List>
          </Sider>
        </Layout>
      </Content>
    </Layout>
  </Affix>
}

export default Classroom
