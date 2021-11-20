import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import { Form, Input, Button, Row, Col, Radio } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Background from "../../assets/hero.png";
import "../Login/Login.css";

const Register = () => {
  const [form] = Form.useForm();
  const {
    authActions: { signup },
  } = useAuthContext();

  const onFinish = (values) => {
    signup(values);
    form.resetFields();
  };

  return (
    <Row className="flex-container">
      <Col md={10}>
        <h1>Create Account</h1>
        <Form name="register" onFinish={onFinish} form={form}>
          <Form.Item
            name="id"
            rules={[
              {
                required: true,
                message: "Please input your University ID number!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="University ID" />
          </Form.Item>
          <Form.Item
            name="full_name"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
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
            >
              Register
            </Button>
            Or Already have an account ? <Link to="/login">Login here</Link>
          </Form.Item>
        </Form>
      </Col>
      <Col md={10}>
        <img src={Background} alt="background" className="bg" />
      </Col>
    </Row>
  );
};

export default Register;
