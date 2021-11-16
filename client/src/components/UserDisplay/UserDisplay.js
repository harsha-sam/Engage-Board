import React from 'react'
import { Avatar, List, Tag } from 'antd'

const UserDisplay = ({ user }) => {
  return <List.Item.Meta
    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
    title={user.full_name}
    description={<>
      <p style={{ marginBottom: "2px" }}>
        {user.id}
      </p>
      <Tag color={user.role === 'faculty' ? 'volcano' : 'cyan'}>
        {user.role.toUpperCase()}
      </Tag>
    </>}
  />
}

export default UserDisplay

