import "./main.css";
import React, { useEffect, useState, useRef } from "react";
import { Layout, Button, Menu, notification, Tag,Breadcrumb } from "antd";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { userLoginoutAPI } from "../api/api";
import { MenuFoldOutlined, MenuUnfoldOutlined,HomeOutlined } from "@ant-design/icons";
import { removeToken } from "../utils/auth";
import { removeType } from "../utils/userType";
import permission from "../utils/permission";
import Common from "../router/common";
import { removeUserInfo, getUserInfo } from "../utils/userInfo";


const { Header, Sider, Content} = Layout;
const colorTag = {
  administrator: "magenta",
  teacher: "green",
  student: "geekblue",
};

const breadcrumbNameMap = {};
(function getBreadcrumbNameMap(data){
  data.forEach(item => {
    breadcrumbNameMap[item.name] = item.title;
    if(item.children){
      getBreadcrumbNameMap(item.children);
    }
  })
}(Common))

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i).slice(1);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <span>{breadcrumbNameMap[url.split('/')[1]]}</span>,
    };
  });
  const breadcrumbItems = [
    {
      title: <Link to="/"><HomeOutlined /></Link>,
      key: 'home',
    },
  ].concat(extraBreadcrumbItems);
 
  const userInfo = JSON.parse(getUserInfo());
  const setMenuData = (data) => {
    return data.map((item, index) => ({
      key: item.url,
      label: item.children ? (
        item.title
      ) : (
        <Link to={item.url}>{item.title}</Link>
      ),
      icon: item.icon,
      children: item.children ? setMenuData(item.children) : null,
    }));
  };
  console.log('菜单数据',permission(Common))
  const [items, setTtems] = useState(setMenuData(permission(Common)));
  const path = useRef(null);
  const [collapsed, setCollapsed] = useState(false); //折叠和展开
  const svg = (
    <svg className={collapsed ? "svg svg_1" : "svg"}>
      <path
        ref={path}
        className="svg-path"
        d="M12 20.35L9.27 18.75C4.86 15.75 2 13.77 2 11.5C2 9.5 3.5 8 5.5 8C6.75 8 8.5 8.66 10 10C11.5 8.66 13.25 8 14.5 8C16.5 8 18 9.5 18 11.5C18 13.77 15.14 15.75 10.73 18.75L8 20.35V22H16V20.35H12Z"
      />
    </svg>
  );

  const logo = (
    <div className="logo-svg">
      {collapsed ? (
        <>{svg}</>
      ) : (
        <>
          {svg}
          <span>高校教务管理系统</span>
        </>
      )}
    </div>
  );
  const onClick = (e) => {
    // console.log("click ", e);
  };
  const handleLoginout = async () => {
    let res = await userLoginoutAPI();
    if (res) {
      const { msg } = res.data;
      notification.success({
        message: msg,
      });
      removeToken();
      removeType();
      removeUserInfo();
      navigate("/login");
    }
  };
  useEffect(() => {
    const len = path.current.getTotalLength();
    path.current.style.setProperty("--l", len + 1);
  }, []);
  return (
    <div className="module">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo-title">{logo}</div>
          <Menu
            onClick={onClick}
            // defaultSelectedKeys={["index"]}
            selectedKeys={[location.pathname]}
            // defaultOpenKeys={[selectKey]}
            mode="inline"
            items={items}
            theme="dark"
          />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="header-left">
              {/* 折叠展开 */}
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "collapsed",
                  onClick: () => {
                    setCollapsed(!collapsed);
                  },
                }
              )}
               <Breadcrumb className="breadcrumb" items={breadcrumbItems} />
            </div>
            <div className="header-right">
              <h4>{userInfo.account || "未知"}</h4>
              <Tag color={colorTag[userInfo.role_name]}>
                {userInfo.role_dsc}
              </Tag>
              <Button type="primary" onClick={handleLoginout}>
                退出
              </Button>
            </div>
          </Header>
          <Content
            className="site-layout-backgound"
            style={{ margin: 10, padding: 10 }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
