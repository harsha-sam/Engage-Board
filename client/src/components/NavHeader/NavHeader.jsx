// Navigation Header
import React from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../contexts/AuthContext.jsx";
import MenuCustom from "../MenuCustom/MenuCustom.jsx";
import { CustomAvatar } from "../UserDisplay/UserDisplay.jsx";
import { Layout, Avatar, Popover, Divider, Typography } from "antd";
import { LogoutOutlined, EditOutlined } from "@ant-design/icons";
import accessibility from "../../assets/accessibility.svg";

const { Header } = Layout;
const { Title, Text } = Typography;
const NavHeader = () => {
  let navigate = useNavigate();
  const {
    authState: { user, dyslexiaFontToggled },
    authActions: { signout, toggleDyslexiaFont },
  } = useAuthContext();
  // content to be displayed on the accessibility menu
  const content = (
    <>
      <Title level={4}>Accessibility</Title>
      <Divider />
      <Text>
        If you have difficulty reading try using a font for dyslexia. Click to
        toggle.
      </Text>
    </>
  );
  const headerOptions = [
    {
      icon: <CustomAvatar user={user} />,
      name: user.full_name,
      id: user.id,
      // Dropdown options on clicking user
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
          id: "logout",
          onClick: signout,
        },
      ],
    },
    {
      icon: (
        // dyslexia font accessibility
        <Popover trigger="hover" content={content}>
          <Avatar src={accessibility} style={{ backgroundColor: "#A0AEC0" }} />
        </Popover>
      ),
      id: "accessibility",
      onClick: toggleDyslexiaFont,
    },
  ];

  return (
    <Header>
      <MenuCustom
        items={headerOptions}
        mode="horizontal"
        selectedKeys={dyslexiaFontToggled ? ["accessibility"] : []}
      />
    </Header>
  );
};

export default NavHeader;
