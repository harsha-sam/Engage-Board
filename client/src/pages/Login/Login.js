import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Background from '../../assets/hero.png';
import './Login.css'
import { useAuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [form] = Form.useForm();
  const {authActions: {signin}} = useAuthContext()

  const onFinish = (values) => {
    signin(values)
    form.resetFields();
  };

  return (
    <Row className="flex-container">
      <Col md={10}>
        <h1>
          Login to your account
        </h1>
        <Form
          name="login"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
                type: 'email'
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
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <Link to="/register">Register now!</Link>
          </Form.Item>
        </Form>
      </Col>
      <Col md={10}>
        <img src={Background} alt="" className="bg"/>
      </Col>
    </Row>
  )
}

export default Login
