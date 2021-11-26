import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { useUsersContext } from "../../contexts/UsersContext.jsx";
import { useClassroomContext } from "../../contexts/ClassroomContext.jsx";
import { useClassroomsContext } from "../../contexts/ClassroomsContext.jsx";
import { DummyMessages } from "../MessagesList/MessagesList.jsx";
import UserDisplay from "../UserDisplay/UserDisplay.jsx";
import {
  Modal,
  Select,
  Radio,
  List,
  Tabs,
  Tooltip,
  Spin,
  Button,
  Popconfirm,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const ManageUsers = ({ showModal, onClose }) => {
  // current user info
  const {
    authState: { user },
  } = useAuthContext();
  // list of all users to display in the adding users select modal
  const {
    usersState: { users, isLoading: usersLoading },
    usersActions: { getListOfUsers },
  } = useUsersContext();
  const {
    classroomState: { id, isLoading, requests, members },
    classroomActions: { getRequests },
  } = useClassroomContext();
  const {
    // for adding and removing members in the classroom
    classroomsActions: { addUserToClassroom, leaveClassroom },
  } = useClassroomsContext();

  const [role, setRole] = useState("student");

  useEffect(() => {
    if (showModal) {
      getRequests();
      getListOfUsers();
    }
  }, [getRequests, getListOfUsers, showModal]);

  const handleClose = () => {
    setRole("");
    onClose();
  };

  const onChange = (e) => setRole(e.target.value);

  const handleAddUser = (payload) => {
    payload = { ...payload, classroom_id: id };
    addUserToClassroom(payload);
    handleClose();
  };

  const handleRemoveUser = (payload) => {
    payload = { ...payload, classroom_id: id };
    leaveClassroom(payload);
    handleClose();
  };

  return (
    <Modal
      title=""
      visible={showModal}
      onCancel={handleClose}
      footer={null}
      closable={true}
      maskClosable={false}
    >
      <Tabs defaultActiveKey="add_users" centered onChange={() => setRole("student")}>
        <TabPane tab="Add User" key="add_users">
          {usersLoading ? (
            // loader will be displayed, if the list of users is loading
            <Spin tip="Loading..." />
          ) : (
            <SearchAndListUsers
              role={role}
              handleOnSave={handleAddUser}
              onRoleChange={onChange}
              users={users}
              members={members}
              type="add"
              buttonText={"Add"}
            />
          )}
        </TabPane>
        <TabPane tab="Pending Requests" key="pending_requests">
          {isLoading ? (
            // loader will be displayed, if the list of requests are loading
            <DummyMessages length={2} />
          ) : (
            <AddUsersViaReqests
              requests={requests}
              handleAdd={handleAddUser}
              role={role}
              onRoleChange={onChange}
            />
          )}
        </TabPane>
        <TabPane tab="Remove User" key="remove_users">
          {usersLoading ? (
            // loader will be displayed, if the list of users are loading
            <Spin tip="Loading..." />
          ) : (
            <SearchAndListUsers
              handleOnSave={handleRemoveUser}
              users={users}
              members={members}
              type="remove"
              currentUserId={user.id}
              buttonText={"Remove"}
            />
          )}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

const SearchAndListUsers = ({
  role,
  onRoleChange,
  users,
  members,
  handleOnSave,
  type,
  currentUserId,
  buttonText,
}) => {
  const { Option } = Select;
  const [selectedUser, setSelectedUser] = useState();
  const [options, setOptions] = useState([]);

  const handleSave = () => {
    if (type === "add") handleOnSave({ new_user_id: selectedUser, role });
    else handleOnSave({ user_id: selectedUser });
  };

  useEffect(() => {
    if (type === "add") {
      // only users who are not part of the classroom will be shown in the select menu
      setOptions(
        users.filter((user) => {
          return !members[user.id];
        })
      );
    } else {
      // only users who are part of the classroom except admin are shown in the select menu.
      let removableUsers = [];
      Object.keys(members).forEach((id) => {
        let member = members[id];
        if (member.id !== currentUserId && member.role !== "admin")
          removableUsers.push(member);
      });
      setOptions(removableUsers);
    }
  }, [members, users, currentUserId, type]);

  return (
    <div className="form-container">
      <div>
        <Select
          placeholder="Search a user by name or ID"
          className="select"
          autoComplete="off"
          showSearch
          filterOption={(val, option) => {
            // search users by name or ID
            return (
              option.value.toLowerCase().includes(val.toLowerCase()) ||
              option.name.toLowerCase().includes(val.toLowerCase())
            );
          }}
          value={selectedUser}
          onSelect={setSelectedUser}
        >
          {options.map((user) => {
            return (
              <Option value={user.id} key={user.id} name={user.full_name}>
                <UserDisplay user={user} showLink={false} />
              </Option>
            );
          })}
        </Select>
      </div>
      {type === "add" && (
        // if this is adding users tab
        <div>
          <label>Role: </label>
          <Radio.Group onChange={onRoleChange} value={role}>
            <Radio value="monitor">Monitor</Radio>
            <Radio value="student">Student</Radio>
          </Radio.Group>
        </div>
      )}
      <Button
        type="primary"
        disabled={type === "add" ? !role || !selectedUser : !selectedUser}
        onClick={handleSave}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const AddUsersViaReqests = ({ requests, handleAdd, role, onRoleChange }) => {
  if (!requests.length) {
    return <span>No requests found</span>;
  }
  return (
    <List
      itemLayout="horizontal"
      dataSource={requests}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Popconfirm
              title={
                <>
                  <h3>Pick the role of this user in the classroom</h3>
                  <Radio.Group onChange={onRoleChange} value={role}>
                    <Radio value="monitor">Monitor</Radio>
                    <Radio value="student">Student</Radio>
                  </Radio.Group>
                </>
              }
              okText="Add user"
              onConfirm={() => {
                handleAdd({
                  new_user_id: item.user.id,
                  request_id: item.id,
                  role,
                });
              }}
            >
              <Tooltip title="Accept">
                <CheckCircleOutlined />
              </Tooltip>
            </Popconfirm>,
          ]}
        >
          <UserDisplay user={item.user} showLink={false} />
        </List.Item>
      )}
    />
  );
};

export default ManageUsers;
