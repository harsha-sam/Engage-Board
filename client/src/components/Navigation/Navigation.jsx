import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import MenuCustom from "../MenuCustom/MenuCustom.jsx";
import NavHeader from "../NavHeader/NavHeader.jsx";
import DirectMessagesSearch from "./DirectMessagesSearch.jsx";
import { Layout, Affix } from "antd";
import { TeamOutlined, BookOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const Navigation = () => {
  // pathname will be the current selected key in sidebar
  const { pathname } = useLocation();
  let navigate = useNavigate();

  // siderbar options
  const siderOptions = [
    {
      icon: <TeamOutlined />,
      name: "Classrooms",
      id: "/classrooms",
      onClick: () => navigate("/classrooms"),
    },
    {
      icon: <BookOutlined />,
      name: "Notes",
      id: "/notes",
      onClick: () => navigate("/notes"),
    },
  ];

  return (
    // wrapping around affix to fix the component to viewport
    <Affix>
      <Layout>
        {/* Header */}
        <NavHeader />
        <Layout>
          {/* Sidebar */}
          <Sider
            collapsible
            breakpoint="md"
            width={280}
            style={{ height: "100vh", zIndex: 1 }}
          >
            <MenuCustom
              items={siderOptions}
              mode="inline"
              selectedKeys={[pathname]}
            />
            {/* Direct Messages Users Search */}
            <DirectMessagesSearch />
          </Sider>
          <Content style={{ height: "100vh" }}>
            {/* Displaying sub route component */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Affix>
  );
};

export default Navigation;
