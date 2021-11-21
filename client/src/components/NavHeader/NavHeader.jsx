import React from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import MenuCustom from "../MenuCustom/MenuCustom.jsx";
import { Layout, Avatar, Popover, Divider, Typography } from "antd";
import { LogoutOutlined, EditOutlined } from "@ant-design/icons";
import accessibility from "../../assets/accessibility.svg";
import { CustomAvatar } from "../UserDisplay/UserDisplay.jsx";

const { Header } = Layout;
const { Title, Text } = Typography;
const NavHeader = () => {
  let navigate = useNavigate();
  const {
    authState: { user, dyslexiaFontToggled },
    authActions: { signout, toggleDyslexiaFont },
  } = useAuthContext();
  const content = (
    <>
      <Title level={4}>Accessibilty</Title>
      <Divider />
      <Text>If you have difficulty reading try using a font for dyslexia.</Text>
    </>
  );
  const headerOptions = [
    {
      icon: <CustomAvatar user={user}/>,
      name: user.full_name,
      id: user.id,
      channels: [
        {
          icon: <EditOutlined />,
          name: "Update User Profile",
          id: "user profile",
          onClick: () => navigate("/profile"),
        },
        {
          icon: <LogoutOutlined />,
          name: "Logout",
          id: "Logout",
          onClick: signout,
        },
      ],
    },
    {
      icon: (
        <Popover trigger="hover" content={content}>
          <Avatar src={accessibility} style={{ backgroundColor: "#A0AEC0" }} />
        </Popover>
      ),
      id: "Accessibilty",
      onClick: toggleDyslexiaFont,
    },
  ];

  return (
    <Header>
      <MenuCustom
        items={headerOptions}
        mode="horizontal"
        selectedKeys={dyslexiaFontToggled ? ["Accessibilty"] : []}
      />
    </Header>
  );
};

export default NavHeader;
