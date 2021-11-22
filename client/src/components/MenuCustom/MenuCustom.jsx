import React from "react";
import { Menu } from "antd";

const { SubMenu } = Menu;

// Custom menu that renders nested sidebar options
const MenuCustom = ({ items, logo, onClick, ...props }) => {
  // caching all sub options
  const channels = [];
  // dfs to generate menu list
  const generateMenuList = (menuList) => {
    return menuList.map((item) => {
      if (item.channels) {
        return (
          <SubMenu key={item.id} icon={item.icon} title={item.name}>
            {generateMenuList(item.channels)}
          </SubMenu>
        );
      } else {
        channels.push(item);
        return (
          <Menu.Item icon={item.icon || "#"} key={item.id}>
            {item.name}
          </Menu.Item>
        );
      }
    });
  };

  const handleClick = ({ key }) => {
    for (const child of channels) {
      if (child.id === key && child.onClick) {
        child.onClick();
        break;
      }
    }
  };

  return (
    <Menu theme="dark" onClick={onClick || handleClick} {...props}>
      {logo && logo}
      {generateMenuList(items)}
    </Menu>
  );
};

export default MenuCustom;
