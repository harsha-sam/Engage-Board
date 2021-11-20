import React from "react";
import { Avatar, List, Tag } from "antd";

const UserDisplay = ({ user, showTag = true, title }) => {
  let color = "blue";
  if (["admin", "faculty"].includes(user.role)) {
    color = "red";
  } else if (user.role === "monitor") {
    color = "green";
  }
  return (
    <List.Item.Meta
      style={{ marginBottom: "10px", marginLeft: "20px" }}
      avatar={
        <Avatar style={{ backgroundColor: color, verticalAlign: "middle" }}>
          {user.full_name[0]}
        </Avatar>
      }
      title={title || user.full_name}
      description={
        <>
          <small style={{ marginBottom: "2px", color: "grey" }}>
            {user.id}
          </small>
          <br />
          {showTag && (
            <Tag color={color}>
              {user.role[0].toUpperCase() + user.role.slice(1)}
            </Tag>
          )}
        </>
      }
    />
  );
};

export default UserDisplay;
