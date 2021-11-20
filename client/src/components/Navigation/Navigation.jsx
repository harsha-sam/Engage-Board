import React from "react";
import { Outlet, useLocation } from "react-router";
import { Layout, Affix } from "antd";
import { useNavigate } from "react-router";
import MenuCustom from "../MenuCustom/MenuCustom.jsx";
import NavHeader from "../NavHeader/NavHeader.jsx";
import DirectMessagesSearch from "./DirectMessagesSearch.jsx";
import { TeamOutlined, BookOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

const Navigation = () => {
  const { pathname } = useLocation();
  let navigate = useNavigate();

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
    <Affix>
      <Layout>
        <NavHeader />
        <Layout>
          <Sider collapsible width={260} style={{ height: "100vh" }}>
            <MenuCustom
              items={siderOptions}
              mode="inline"
              selectedKeys={[pathname]}
            />
            <DirectMessagesSearch />
          </Sider>
          <Content style={{ height: "100vh" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Affix>
  );
};

export default Navigation;
