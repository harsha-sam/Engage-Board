import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import AvatarUploader from "../../components/AvatarUploader/AvatarUploader";
import { Form, Button, Input, Spin, Typography } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import "./EditUserProfile.css";

const { Title } = Typography;

const EditUserProfile = () => {
  const {
    authState: { user, isLoading },
  } = useAuthContext();
  const [fullName, setFullName] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setFullName(user.full_name);
  }, [user]);

  useEffect(() => {
    setIsValid(false);
  }, []);

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    setIsValid(true);
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <div className="user_profile_wrapper">
        <Title level={3}>User Profile</Title>
        <br />
        <Form.Item label="University ID">
          <Input prefix={<UserOutlined />} value={user.id} disabled />
        </Form.Item>
        <Form.Item label="Email">
          <Input prefix={<MailOutlined />} value={user.email} disabled />
        </Form.Item>
        <Form.Item label="Full Name">
          <Input
            prefix={<UserOutlined />}
            value={fullName}
            onChange={handleFullNameChange}
          />
        </Form.Item>
        <Form.Item label="Change Avatar">
          <AvatarUploader />
        </Form.Item>
        <Button type="primary" disabled={!isValid}>
          Save
        </Button>
      </div>
    </>
  );
};

export default EditUserProfile;
