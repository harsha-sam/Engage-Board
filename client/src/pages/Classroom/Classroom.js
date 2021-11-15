import React, { useState, useEffect } from 'react'
import { Affix, Layout, List, Avatar, Tag, Typography, Divider } from 'antd';
import Logo from '../../components/Logo/Logo';
import MessagesList from '../../components/MessagesList/MessagesList';
import MenuCustom from '../../components/MenuCustom/MenuCustom';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { useChatContext } from '../../contexts/ChatContext';
import { useParams } from 'react-router';
import NavHeader from '../../components/NavHeader/NavHeader';

const { Sider, Content } = Layout;

const { Paragraph } = Typography;
const Classroom = () => {
  const { classroomState, classroomActions: { getClassroom } } = useClassroomContext();
  const { chatActions: { selectChannel }} = useChatContext();
  const { id } = useParams();
  const {
    name,
    description,
    members,
    categories,
  } = classroomState;
  const [isLoading, setIsLoading] = useState(true);
  const [openedChannelId, setOpenedChannelId] = useState(null);

  useEffect(() => {
    setIsLoading(true)
    getClassroom({ id });
  }, [id])

  useEffect(() => {
    if (classroomState.categories) {
      for (let cat of categories) {
        if (cat.channels.length) {
          setOpenedChannelId(cat.channels[0].id)
          break
        }
      }
      setIsLoading(false)
    }
  }, [classroomState])

  useEffect(() => {
    if (openedChannelId) {
      selectChannel({ id: openedChannelId })
    }
  }, [openedChannelId])

  if (isLoading) {
    return <h1>Loading ...</h1>
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
        <MenuCustom items={categories}
          mode={'inline'}
          onClick={({ key }) => setOpenedChannelId(key)}
          selectedKeys={[openedChannelId]}
          logo={<Logo src={"https://joeschmoe.io/api/v1/random"} name={name} />}
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
            <h1>chat box</h1>
          </Content>
          <Sider theme="dark" width={240} style={{ height: '100vh', padding: '3% 5%' }} collapsible reverseArrow>
            <Paragraph
              ellipsis={{
                rows: 4,
                expandable: true,
                symbol: "see more"
              }}
            >
              {description}
            </Paragraph>
            <Divider />
            <List>
              {
                members.map((member) => {
                  return <List.Item key={member.id} style={{ padding: '0 10%'}}>
                    <List.Item.Meta
                      style={{color: '#fff'}}
                      avatar={<Avatar src={"https://joeschmoe.io/api/v1/random"} />}
                      title={<a href="https://ant.design">{member.full_name}</a>}
                      description={<Tag color="red">{member.role}</Tag>}
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
