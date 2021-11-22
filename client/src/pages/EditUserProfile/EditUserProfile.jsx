import React from "react";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import useLoader from "../../hooks/useLoader";
import { Form, Button, Input, Spin, Typography } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import "./EditUserProfile.css";

const { Title } = Typography;

//  Editing User Profile Component
const EditUserProfile = () => {
  const {
    authState: { user, isLoading },
    authActions: { updateUser },
  } = useAuthContext();
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useLoader(false);

  const onFinish = (values) => {
    // submit button loader should be triggered
    const { full_name, email } = values;
    // if only the form has new values
    if (user.full_name !== full_name || user.email !== email) {
      setIsSubmitted(true);
      updateUser({ email, full_name }).finally(() => {
        // submit button loader should be stopped
        setIsSubmitted(false);
        form.resetFields();
        // form fields should be reset
      });
    }
  };

  if (isLoading) {
    return <Spin />;
  }
  return (
    <div className="user_profile_wrapper">
      <Title level={3}>User Profile</Title>
      <br />
      <Form
        name="update user"
        onFinish={onFinish}
        form={form}
        initialValues={{
          full_name: user.full_name,
          email: user.email,
          id: user.id,
        }}
      >
        <Form.Item label="University ID" name="id">
          <Input prefix={<UserOutlined />} disabled />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input prefix={<MailOutlined />} />
        </Form.Item>
        <Form.Item label="Full Name" name="full_name">
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitted}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditUserProfile;
