import React from "react";
import { Avatar, List, Tag } from "antd";

const getColor = (role) => {
  let color = "blue";
  if (["admin", "faculty"].includes(role)) {
    color = "red";
  } else if (role === "monitor") {
    color = "green";
  }
  return color;
}

const UserDisplay = ({ user, showTag = true, title }) => {
  return (
    <List.Item.Meta
      style={{ marginBottom: "10px", marginLeft: "20px" }}
      avatar={<CustomAvatar user={user}/>}
      title={title || user.full_name}
      description={
        <>
          <small style={{ marginBottom: "2px", color: "grey" }}>
            {user.id}
          </small>
          <br />
          {showTag && (
            <Tag color={getColor(user?.role)}>
              {user.role[0].toUpperCase() + user.role.slice(1)}
            </Tag>
          )}
        </>
      }
    />
  );
};

export const CustomAvatar = ({ user }) => {
  return <Avatar style={{ backgroundColor: getColor(user?.role), verticalAlign: "middle", margin: "5px" }}>
    {user.full_name[0]}
  </Avatar>
}

export default UserDisplay;
