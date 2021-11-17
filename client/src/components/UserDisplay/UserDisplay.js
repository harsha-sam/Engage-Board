import React from 'react'
import { Avatar, List, Tag } from 'antd'

const UserDisplay = ({ user, showTag=true, title }) => {
  let color = "blue"
  if (['admin', 'faculty'].includes(user.role)) {
    color = "red";
  }
  else if (user.role === 'monitor') {
    color = "green"
  }
  return <List.Item.Meta
    style={{marginBottom: '10px', marginLeft: "20px"}}
    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
    title={title || user.full_name}
    description={<>
      <small style={{ marginBottom: "2px", color: 'grey' }}>
        {user.id}
      </small>
      <br />
      {
        showTag &&
        <Tag color={color}>
          {user.role.toUpperCase()}
        </Tag>
      }
    </>}
  />
}

export default UserDisplay

