import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import { useChatContext } from "../../contexts/ChatContext.jsx";
import useLoader from "../../hooks/useLoader";
import ClassroomSidebarHeader from "../../components/ClassroomSidebarHeader/ClassroomSidebarHeader.jsx";
import NavHeader from "../../components/NavHeader/NavHeader.jsx";
import MenuCustom from "../../components/MenuCustom/MenuCustom.jsx";
import EmptyCustom from "../../components/EmptyCustom/EmptyCustom.jsx";
import MessagesList from "../../components/MessagesList/MessagesList.jsx";
import UserDisplay from "../../components/UserDisplay/UserDisplay.jsx";
import { Affix, Layout, Menu, Typography, Spin , Divider} from "antd";
import { TeamOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Paragraph, Title } = Typography;

const Classroom = () => {
  const {
    authState: { user },
  } = useAuthContext();
  const {
    classroomState,
    classroomActions: { getClassroom },
  } = useClassroomContext();
  const {
    chatState: { channel },
    chatActions: { selectChannel },
  } = useChatContext();
  // classroom id will be in the route params /classrooms/:id
  const { id } = useParams();
  // current classroom info will be available in the classroom state
  const { description, members, total_members, categories } = classroomState;
  const [pageLoading, setPageLoading] = useLoader(true);
  // classroom members roles
  const [admins, setAdmins] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [students, setStudents] = useState([]);
  // category options to be rendered in sidebar menu
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    getClassroom({ id });
  }, [id, getClassroom]);

  useEffect(() => {
    // flag used to select the first available channel by default whenever the page is loaded
    let flag = channel === null;
    if (categories) {
      let newCategories = categories.map((category) => {
        let newCategory = { ...category };
        // on clicking a channel, chat should be updated
        let newChannels = category.channels.map((currentChannel) => {
          if (currentChannel.id === channel?.id) {
            if (
              channel?.message_permission !== currentChannel.message_permission
            )
              selectChannel(currentChannel);
            flag = false;
          }
          return {
            ...currentChannel,
            onClick: () => selectChannel(currentChannel),
          };
        });
        newCategory.channels = newChannels;
        if (newChannels.length && flag) {
          // selecting this channel
          selectChannel(newChannels[0]);
          flag = false;
        }
        return newCategory;
      });
      setCategoryOptions(newCategories);
      // as all the categories and channels are loaded, page loader can be reset to false and data should be shown
      setPageLoading(false);
    }
    // eslint-disable-next-line
  }, [categories, selectChannel, setPageLoading]);

  useEffect(() => {
    // segregating classroom members
    let newAdmins = [];
    let newMonitors = [];
    let newStudents = [];
    Object.keys(members).forEach((id) => {
      let member = members[id];
      if (member.role === "admin") newAdmins.push(member);
      else if (member.role === "monitor") newMonitors.push(member);
      else newStudents.push(member);
    });
    setAdmins(newAdmins);
    setMonitors(newMonitors);
    setStudents(newStudents);
  }, [members]);

  // permitted will check if the current user can message in the channel
  const permitted = useMemo(() => {
    if (channel) {
      return channel.message_permission?.includes(members[user.id]?.role);
    } else {
      return true;
    }
  }, [members, channel, user]);

  if (pageLoading) {
    return <Spin tip="Loading..." className="spinner" />;
  }

  return (
    // wrapping the entire page with affix to make it fixed to viewport
    <Affix>
      <Layout>
        <Sider
          theme="dark"
          className="left-sidebar"
          style={{ height: "100vh", zIndex: 2 }}
          breakpoint="md"
          width={240}
          collapsible
          collapsedWidth={0}
        >
          {/* Sidebar header will contain all the settings and actions of the classroom */}
          <ClassroomSidebarHeader />
          <MenuCustom
            items={categoryOptions}
            mode={"inline"}
            // current channel selected
            selectedKeys={[channel?.id]}
            // all categories are opened by default
            defaultOpenKeys={categories.map((category) => category.id)}
            style={{ height: "60%", overflow: "auto" }}
          />
          <Divider className="divider" />
        </Sider>
        <Content>
          <Layout>
            <Content>
              <Layout>
                {/* Navigation Header for accessibility and user options */}
                <NavHeader />
                {/* All messages list */}
                {channel ? (
                  <MessagesList
                    wrapperClassName={"messages-list"}
                    permittedToMessage={permitted}
                  />
                ) : (
                  <EmptyCustom description="No channels found" />
                )}
              </Layout>
            </Content>
            {/* Right sidebar */}
            <Sider
              theme="dark"
              className="right-sidebar"
              breakpoint="lg"
              reverseArrow={true}
              collapsible
              width={240}
              collapsedWidth={0}
              style={{
                padding: "5% 1%",
                zIndex: "1",
                position: "sticky",
                height: "100vh",
              }}
            >
              {/* Description of the classroom is displayed at top of right sidebar */}
              <Title style={{ color: "#fff" }} level={4}>
                Description
              </Title>
              <Paragraph
                style={{
                  color: "#fff",
                  textAlign: "justify",
                  marginBottom: "15px",
                  overflow: "auto",
                  maxHeight: "40%",
                }}
                ellipsis={{
                  rows: 5,
                  expandable: true,
                  symbol: "see more",
                }}
              >
                {description}
              </Paragraph>
              <Divider className="divider" />
              {/* Menu showing members of this classroom along with their segregated roles*/}
              <Menu
                mode="inline"
                theme="dark"
                defaultOpenKeys={["members", "Admin", "Monitors", "Students"]}
                selectable={false}
                style={{ overflow: "auto", height: "60vh" }}
              >
                {/* Sub menu will be displayed only if members are available under that role */}
                <SubMenu
                  title={`Members (${total_members})`}
                  key="members"
                  icon={<TeamOutlined />}
                >
                  {admins.length > 0 && (
                    <SubMenu title="Admin" key="Admin">
                      {admins.map((admin) => (
                        <UserDisplay
                          user={admin}
                          key={admin.id}
                          // false because we don't want to show the member role tag again as the members are already being segregated on basis of the role
                          showTag={false}
                        />
                      ))}
                    </SubMenu>
                  )}
                  {monitors.length > 0 && (
                    <SubMenu title="Monitors" key="Monitors">
                      {monitors.map((monitor) => (
                        <UserDisplay
                          user={monitor}
                          key={monitor.id}
                          showTag={false}
                        />
                      ))}
                    </SubMenu>
                  )}
                  {students.length > 0 && (
                    <SubMenu title="Students" key="Students">
                      {students.map((student) => (
                        <UserDisplay
                          user={student}
                          key={student.id}
                          showTag={false}
                        />
                      ))}
                    </SubMenu>
                  )}
                </SubMenu>
              </Menu>
            </Sider>
          </Layout>
        </Content>
      </Layout>
    </Affix>
  );
};

export default Classroom;
