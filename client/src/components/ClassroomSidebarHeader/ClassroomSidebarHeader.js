import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../contexts/AuthContext';
import { useUsersContext } from '../../contexts/UsersContext';
import { useClassroomsContext } from '../../contexts/ClassroomsContext';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { DummyMessages } from '../MessagesList/MessagesList';
import Logo from '../Logo/Logo';
import UserDisplay from '../UserDisplay/UserDisplay'
import { Menu, Button, Modal, Tabs, Select, Radio, List, Tooltip, Popconfirm } from 'antd';
import { CheckCircleOutlined, SettingOutlined } from '@ant-design/icons'
import './ClassroomSidebarHeader.css';

const { TabPane } = Tabs;
const { SubMenu } = Menu;

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

  const handleRemoveUser = (payload) => {
    setShowUsersModal(false)
    payload = { ...payload, classroom_id: id }
    leaveClassroom(payload)
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
              Add / Remove a user
            </Button>
          </Menu.Item>
        </SubMenu>
      }
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
        <TabPane tab="Add User" key="0">
          {usersLoading ? <DummyMessages length={2} />
            : <SearchAndListUsers
              role={role}
              handleOnSave={handleAddUser}
              onRoleChange={onChange}
              users={users}
              members={members}
              type="add"
              buttonText={"Add"}
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
        <TabPane tab="Remove User" key="2">
          {usersLoading ? <DummyMessages length={2} />
            : <SearchAndListUsers
              handleOnSave={handleRemoveUser}
              users={users}
              members={members}
              type="remove"
              currentUserId={user.id}
              buttonText={"Remove"}
            />
          }
        </TabPane>
      </Tabs>
    </Modal>
  </>)
}

const SearchAndListUsers = ({ role, onRoleChange,
  users, members, handleOnSave, type, currentUserId, buttonText }) => {
  const { Option } = Select;
  const [selectedUser, setSelectedUser] = useState();
  const [options, setOptions] = useState([]);

  const handleSave = () => {
    if (type === 'add') handleOnSave({ new_user_id: selectedUser, role })
    else handleOnSave({ user_id: selectedUser })
  }

  useEffect(() => {
    if (type === 'add') {
      setOptions(users.filter((user) => {
        return !(members.some((member) => member.id === user.id))
      }))
    }
    else {
      setOptions(members.filter((member) =>
        (member.id !== currentUserId && member.role !== 'admin')
      ))
    }
  }, [members])

  return <div className="form-container">
    <div>
      <Select
        placeholder="Search a user by name or ID"
        className="select"
        showSearch
        filterOption={(val, option) => {
          return option.value.includes(val) ||
            option.name.toLowerCase().includes(val.toLowerCase())
        }}
        value={selectedUser}
        onSelect={setSelectedUser}
      >
        {
          options.map((user) => {
            return <Option value={user.id} key={user.id} name={user.full_name}>
              <UserDisplay user={user} />
            </Option>
          })
        }
      </Select>
    </div>
    {type === "add" &&
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
    }
    <Button type="primary"
      disabled={type === 'add' ? (!role || !selectedUser) : (!selectedUser)}
      onClick={handleSave}>
      {buttonText}
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
            <h3>Pick the role of this user in the classroom</h3>
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
