import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import useLoader from "../../hooks/useLoader";
import { Form, Input, Button, Row, Col, Radio, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Background from "../../assets/hero.png";
import logo from "../../assets/Logo/cover.png";
import "../Login/Login.css";

const { Title } = Typography;
const Register = () => {
  const [form] = Form.useForm();
  const {
    authActions: { signup },
  } = useAuthContext();

  const [isSubmitted, setIsSubmitted] = useLoader(false);

  const onFinish = (values) => {
    // submit button loader should be triggered
    setIsSubmitted(true);
    signup(values).finally(() => {
      // submit button loader should be stopped
      setIsSubmitted(false);
      // form fields should be reset
      form.resetFields();
    });
  };

  return (
    <Row className="flex-container">
      <Col md={20} lg={10}>
        <img src={logo} alt="logo" className="app-logo" />
        <Title level={3} type="secondary">
          Create Account
        </Title>
        <br />
        <Form
          name="register"
          onFinish={onFinish}
          form={form}
          autoComplete="off"
        >
          <Form.Item
            name="id"
            label="University Enrollment ID"
            tooltip="University Enrollment ID should be unique"
            rules={[
              {
                required: true,
                message: "Please input your University Enrollment ID!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your Unique ID" />
          </Form.Item>
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Type your Name here"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            tooltip="Email should be unique"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
                type: "email",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please pick a role!" }]}
          >
            <Radio.Group>
              <Radio value="faculty">Faculty</Radio>
              <Radio value="student">Student</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isSubmitted}
            >
              Register
            </Button>
            Or Already have an account ? <Link to="/login">Login here</Link>
          </Form.Item>
        </Form>
      </Col>
      <Col md={20} lg={10}>
        <img src={Background} alt="background" className="bg" />
      </Col>
    </Row>
  );
};

export default Register;
