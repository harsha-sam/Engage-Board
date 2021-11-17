import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../contexts/AuthContext';
import AvatarUploader from '../../components/AvatarUploader/AvatarUploader';
import { Button, Input, Spin, Typography } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import './EditUserProfile.css';

const { Title } = Typography;

const EditUserProfile = () => {
  const { authState: { user, isLoading } } = useAuthContext();
  const [fullName, setFullName] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setFullName(user.full_name)
  }, [user])

  useEffect(() => {
    setIsValid(false)
  }, [])

  const handleFullNameChange = (e) => {
    setFullName(e.target.value)
    setIsValid(true)
  }

  if (isLoading) {
    return <Spin />
  }

  return (<>
    <Title level={3}>User Profile</Title>
    <div className="user_profile_wrapper">
      <div>
        <label>University ID:</label>
        <Input prefix={<UserOutlined />} value={user.id} disabled />
      </div>
      <div>
        <label>Email:</label>
        <Input prefix={<MailOutlined />} value={user.email} disabled />
      </div>
      <div>
        <label>Full Name:</label>
        <Input prefix={<UserOutlined />} value={fullName} onChange={handleFullNameChange} />
      </div>
      <div>
        <label>Change Avatar:</label>
        <AvatarUploader />
      </div>
      <Button type="primary" disabled={!isValid}>Save</Button>
    </div>
  </>
  )
}

export default EditUserProfile
