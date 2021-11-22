import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
// loader hook
import useLoader from "../../hooks/useLoader";
import { Form, Input, Button, Row, Col, Typography } from "antd";
// icons
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Background from "../../assets/hero.png";
import "./Login.css";

const { Title } = Typography;
const Login = () => {
  // ref container to the login form
  const [form] = Form.useForm();
  const {
    authActions: { signin },
  } = useAuthContext();

  const [isSubmitted, setIsSubmitted] = useLoader(false);

  const onFinish = (values) => {
    // submit button loader should be triggered
    setIsSubmitted(true);
    // on form submit, signin auth action should be triggered
    signin(values).finally(() => {
      // submit button loader should be stopped
      setIsSubmitted(false);
      // form fields should be reset
      form.resetFields();
    });
  };

  return (
    <Row className="flex-container">
      <Col md={10}>
        <Title level={2}>Login to your account</Title>
        <Form name="login" onFinish={onFinish} form={form}>
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isSubmitted}
            >
              Log in
            </Button>
            Or <Link to="/register">Register now!</Link>
          </Form.Item>
        </Form>
      </Col>
      <Col md={10}>
        <img src={Background} alt="background" className="bg" />
      </Col>
    </Row>
  );
};

export default Login;
