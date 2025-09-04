import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const sidebarStyle = (collapsed) => ({
  width: collapsed ? 60 : 220,
  background: "#f5f5f5",
  height: "100vh",
  padding: 20,
  boxSizing: "border-box",
  transition: "width 0.2s",
  overflow: "hidden",
});

const headerStyle = {
  height: 60,
  background: "#1976d2",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  paddingLeft: 24,
  fontSize: 22,
  fontWeight: "bold",
};

const contentStyle = {
  flex: 1,
  padding: 32,
  background: "#fafbfc",
  minHeight: "calc(100vh - 60px)",
};

const layoutStyle = {
  display: "flex",
};

const linkStyle = {
  display: "block",
  padding: "10px 0",
  color: "#333",
  textDecoration: "none",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const LayoutStaff = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <div style={headerStyle}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            marginRight: 16,
            fontSize: 18,
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "#fff",
          }}
          title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {collapsed ? "☰" : "✖"}
        </button>
        Trang chủ nhân viên
      </div>
      <div style={layoutStyle}>
        <div style={sidebarStyle(collapsed)}>
          <Link to="/staff" style={linkStyle}>🏠 {!collapsed && "Trang chủ"}</Link>
          <Link to="/staff/tasks" style={linkStyle}>📋 {!collapsed && "Công việc"}</Link>
          <Link to="/staff/devices" style={linkStyle}>🖥️ {!collapsed && "Thiết bị cơ sở"}</Link>
          <Link to="/staff/reports" style={linkStyle}>📊 {!collapsed && "Báo cáo"}</Link>
          <Link to="/staff/users" style={linkStyle}>👤 {!collapsed && "Người dùng"}</Link>
          <Link to="/staff/history" style={linkStyle}>🕑 {!collapsed && "Lịch sử"}</Link>
        </div>
        <div style={contentStyle}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutStaff;