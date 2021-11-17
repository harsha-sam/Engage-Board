import React, { useState, useEffect } from 'react'
import { Affix, Layout, Menu, Typography, Spin, Tag } from 'antd';
import MessagesList from '../../components/MessagesList/MessagesList';
import MenuCustom from '../../components/MenuCustom/MenuCustom';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { useChatContext } from '../../contexts/ChatContext';
import { useParams } from 'react-router';
import NavHeader from '../../components/NavHeader/NavHeader';
import ClassroomSidebarHeader from '../../components/ClassroomSidebarHeader/ClassroomSidebarHeader';
import UserDisplay from '../../components/UserDisplay/UserDisplay';
import SubMenu from 'antd/lib/menu/SubMenu'
import { TeamOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const { Paragraph, Title } = Typography;
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
  const [admins, setAdmins] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [students, setStudents] = useState([]);

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

  useEffect(() => {
    let newAdmins = [];
    let newMonitors = [];
    let newStudents = [];
    members.forEach((member) => {
      if (member.role === 'admin')
        newAdmins.push(member)
      else if (member.role === 'monitor')
        newMonitors.push(member)
      else
        newStudents.push(member)
    })
    setAdmins(newAdmins);
    setMonitors(newMonitors);
    setStudents(newStudents);
  }, [members])

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
        <ClassroomSidebarHeader />
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
              <MessagesList wrapperClassName={"messages-list"} />
            </Layout>
          </Content>
          <Sider theme="dark"
            style={{
              padding: "5% 1%",
              overflow: 'auto',
              position: 'sticky',
              height: "100vh",
              right: 0
            }}
            width={240}
          >
            <Title style={{color: '#fff'}} level={4}>Description</Title>
            <Paragraph
              style={{ color: '#fff', textAlign: 'justify', marginBottom: '15px' }}
              ellipsis={{
                rows: 5,
                expandable: true,
                symbol: "see more"
              }}
            >
              {description}
            </Paragraph>
            <Menu mode="inline" theme="dark" defaultOpenKeys={['members']} selectable={false}>
              <Menu.Divider />
              <SubMenu title="Members" key="members" icon={<TeamOutlined />}>
                <SubMenu title="Admin" key="Admin">
                  {admins.map((admin) =>
                    <UserDisplay
                      user={admin}
                      key={admin.id}
                      title={<Tag color="red">
                        {admin.full_name}
                      </Tag>}
                      showTag={false} />)}
                </SubMenu>
                <SubMenu title="Monitors" id="Monitors">
                  {monitors.map((monitor) =>
                    <UserDisplay user={monitor}
                      key={monitor.id}
                      title={<Tag color="green">
                        {monitor.full_name}
                      </Tag>}
                      showTag={false} />)}
                </SubMenu>
                <SubMenu title="Students" id="Students">
                  {students.map((student) =>
                    <UserDisplay user={student}
                      key={student.id}
                      title={<Tag color="blue">
                        {student.full_name}
                      </Tag>}
                      showTag={false} />)}
                </SubMenu>
              </SubMenu>
            </Menu>
          </Sider>
        </Layout>
      </Content>
    </Layout>
  </Affix>
}

export default Classroom
