import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useClassroomsContext } from "../../contexts/ClassroomsContext.jsx";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import ManageUsers from "./ManageUsers.jsx";
import ContentModeration from "./ContentModeration.jsx";
import ManageChannels from "./ManageChannels.jsx";
import { Menu, Button, Popconfirm, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import "./ClassroomSidebarHeader.css";

const { SubMenu } = Menu;

const ClassroomSidebarHeader = () => {
  const {
    authState: { user },
  } = useAuthContext();
  const {
    classroomState: { id, name, members },
  } = useClassroomContext();
  const {
    // for leaving the classroom
    classroomsActions: { leaveClassroom },
  } = useClassroomsContext();
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  // add/remove users modal
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  // manage channels modal
  const [showManageChannelsModal, setShowManageChannelsModal] = useState(false);
  // content moderation modal
  const [showContentModeration, setShowContentModeration] = useState(false);

  useEffect(() => {
    // checking permission to show admin settings
    let permissionCheck = false;
    let member = members[user.id];
    if (member) {
      permissionCheck = member.role === "admin" || member.role === "monitor";
    }
    setShowAdminSettings(permissionCheck);
  }, [user, members]);

  const handleLeaveClassroom = () => {
    leaveClassroom({
      user_id: user.id,
      classroom_id: id,
    });
  };

  return (
    <>
      <Menu
        theme="dark"
        selectable={false}
        mode="vertical"
        style={{ marginBottom: "10%" }}
      >
        {/* classroom name */}
        <Typography.Title level={4} ellipsis={{
          expandable: true,
          rows: 2,
          symbol: "expand"
        }} className="classroom-name">
          {name}
        </Typography.Title>
        {/* only display manage classroom menu for admins and monitors */}
        {showAdminSettings && (
          <SubMenu
            title="Manage Classroom"
            icon={<SettingOutlined />}
            key="Manage Classroom"
          >
            {/* Adding or removing users */}
            <Menu.Item key="add user">
              <Button
                shape="round"
                block={true}
                onClick={() => setShowManageUsersModal(true)}
              >
                Add / Remove a user
              </Button>
              {showManageUsersModal && (
                <ManageUsers
                  showModal={showManageUsersModal}
                  onClose={() => setShowManageUsersModal(false)}
                />
              )}
            </Menu.Item>
            {/* Content Moderation Modal*/}
            <Menu.Item key="content moderation">
              <Button
                shape="round"
                type="primary"
                block={true}
                onClick={() => setShowContentModeration(true)}
              >
                Content moderation
              </Button>
              {showContentModeration && (
                <ContentModeration
                  showModal={showContentModeration}
                  onClose={() => setShowContentModeration(false)}
                />
              )}
            </Menu.Item>
            {/* Manage Channels Modal */}
            <Menu.Item key="manage channels">
              <Button
                shape="round"
                type="dashed"
                block={true}
                onClick={() => setShowManageChannelsModal(true)}
              >
                Manage Channels
              </Button>
              {showManageChannelsModal && (
                <ManageChannels
                  showModal={showManageChannelsModal}
                  onClose={() => setShowManageChannelsModal(false)}
                />
              )}
            </Menu.Item>
          </SubMenu>
        )}
        {/* Leaving classroom */}
        <Menu.Item key="leave classroom">
          <Popconfirm
            title="Note: If you are the admin of this classroom. 
          Leaving it will also delete the classroom. Are you sure?"
            onConfirm={handleLeaveClassroom}
            placement="top"
          >
            <Button shape="round" type="danger" block={true}>
              Leave Classroom
            </Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default ClassroomSidebarHeader;
