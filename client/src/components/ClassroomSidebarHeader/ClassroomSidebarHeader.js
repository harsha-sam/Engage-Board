import React, { useState, useEffect } from 'react'
import Logo from '../Logo/Logo';
import { Menu, Button, Modal, Tabs, Select, Radio, List, Avatar, Tag, Tooltip, Popconfirm } from 'antd';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { DummyMessages } from '../MessagesList/MessagesList';
import { CheckCircleOutlined, SettingOutlined } from '@ant-design/icons'
import SubMenu from 'antd/lib/menu/SubMenu';
import { useClassroomsContext } from '../../contexts/ClassroomsContext';
import { useUsersContext } from '../../contexts/UsersContext';
import UserDisplay from '../UserDisplay/UserDisplay'
import './ClassroomSidebarHeader.css';

const { TabPane } = Tabs;

const ClassroomSidebarHeader = () => {
  const { authState: { user } } = useAuthContext();
  const { classroomsActions: { addUserToClassroom, leaveClassroom } } = useClassroomsContext()
  const { classroomState: { id, name, members, isLoading, requests },
    classroomActions: { getRequests } } = useClassroomContext();
  const { usersState: { users, isLoading: usersLoading }, usersActions: {
    getListOfUsers
  } } = useUsersContext();
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [role, setRole] = useState("");

  const showUserModal = () => {
    getRequests();
    getListOfUsers();
    setRole('');
    setShowUsersModal(true);
  };

  const handleCancel = () => {
    setRole('');
    setShowUsersModal(false);
  };

  const onChange = (e) => setRole(e.target.value)

  const handleAddUser = (payload) => {
    setShowUsersModal(false)
    payload = { ...payload, classroom_id: id }
    addUserToClassroom(payload)
  }

  useEffect(() => {
    let permissionCheck = members.some((member) => {
      return ((member.id === user.id)
        && (member.role === 'admin' || member.role === 'monitor'))
    })
    setShowAdminSettings(permissionCheck);
  }, [user, members])


  return (<>
    <Menu theme="dark" selectable={false} mode="vertical">
      <Logo src={"https://joeschmoe.io/api/v1/random"} name={name} />
      {
        showAdminSettings &&
        <SubMenu title='Manage Classroom' icon={<SettingOutlined />}
          key='Manage Classroom'
        >
          <Menu.Item key="add user">
            <Button shape="round"
              type="dashed"
              block={true}
              onClick={showUserModal}>
              Add a user
            </Button>
          </Menu.Item>
          <Menu.Item key="leave classroom">
            <Popconfirm title="Note: If you are the admin of this classroom. 
              Leaving it will also delete the classroom. Are you sure?"
              onConfirm={() => {
                leaveClassroom({
                  classroom_id: id,
                  user_id: user.id
               })
              }}
              placement="top"
            >
              <Button shape="round" type="danger" block={true}>
                Leave Classroom
              </Button>
            </Popconfirm>
          </Menu.Item>
        </SubMenu>
      }
    </Menu>
    <Modal
      title=""
      visible={showAdminSettings && showUsersModal}
      onCancel={handleCancel}
      footer={null}
      closable={true}
      maskClosable={false}
    >
      <Tabs defaultActiveKey="0" centered onChange={() => setRole('')}>
        <TabPane tab="Add user to classroom" key="0">
          {usersLoading ? <DummyMessages length={2} />
            : <SearchAndAddUsers
              role={role}
              handleAdd={handleAddUser}
              onRoleChange={onChange}
              users={users}
              members={members}
            />
          }
        </TabPane>
        <TabPane tab="Pending Requests" key="1">
          {isLoading ? <DummyMessages length={2} />
            : <AddUsersViaReqests
              requests={requests}
              handleAdd={handleAddUser}
              role={role}
              onRoleChange={onChange} />
          }
        </TabPane>
      </Tabs>
    </Modal>
  </>)
}

const SearchAndAddUsers = ({ role, onRoleChange, users, members, handleAdd }) => {
  const { Option } = Select;
  const [selectedUser, setSelectedUser] = useState();

  const handleSave = () => handleAdd({ new_user_id: selectedUser, role })

  let options = users.filter((user) => {
    return !(members.some((member) => member.id === user.id))
  })

  return <div className="form-container">
    <div>
      <Select
        placeholder="Search a user by name or ID"
        className="select"
        showSearch
        filterOption={(val, option) => {
          return option.value.includes(val) || option.name.includes(val)
        }}
        value={selectedUser}
        onSelect={setSelectedUser}
      >
        {
          options.map((user) => {
            return <Option value={user.id} key={user.id} name={user.full_name}>
              <UserDisplay user={user}/>
            </Option>
          })
        }
      </Select>
    </div>
    <div>
      <label>Role: </label>
      <Radio.Group onChange={onRoleChange} value={role}>
        <Radio value="monitor">
          Monitor
        </Radio>
        <Radio value="student">
          Student
        </Radio>
      </Radio.Group>
    </div>
    <Button type="primary"
      disabled={!role || !selectedUser}
      onClick={handleSave}>
      Save
    </Button>
  </div>
}

const AddUsersViaReqests = ({ requests, handleAdd, role, onRoleChange }) => {
  if (!requests.length) {
    return <span>No requests found</span>
  }
  return <List
    itemLayout="horizontal"
    dataSource={requests}
    renderItem={item => (
      <List.Item actions={[
        <Popconfirm title={
          <>
            <h3>Pick the role</h3>
            <Radio.Group
              onChange={onRoleChange}
              value={role}>
              <Radio value="monitor">
                Monitor
              </Radio>
              <Radio value="student">
                Student
              </Radio>
            </Radio.Group>
          </>}
          okText="Add user"
          onConfirm={() => {
            handleAdd({
              new_user_id: item.user.id,
              request_id: item.id,
              role
            })
          }}
        >
          <Tooltip title="Accept">
            <CheckCircleOutlined />
          </Tooltip>
        </Popconfirm>
      ]}>
        <UserDisplay user={item.user} />
      </List.Item>
    )}
  />
}

export default ClassroomSidebarHeader
