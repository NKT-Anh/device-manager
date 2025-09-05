import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaDesktop, FaChartBar, FaUser, FaHistory } from "react-icons/fa";

const sidebarStyle = (collapsed) => ({
  width: collapsed ? 60 : 220,
  background: "#f5f5f5",
  height: "100vh",
  padding: 20,
  boxSizing: "border-box",
  transition: "width 0.2s",
  overflow: "hidden",
});

const linkStyle = {
  display: "block",
  padding: "10px 0",
  color: "#333",
  textDecoration: "none",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

export default function SidebarStaff({ collapsed }) {
  return (
    <div style={sidebarStyle(collapsed)}>
      <Link to="/staff" style={linkStyle}>
        <FaHome /> {!collapsed && "Trang chủ"}
      </Link>
      <Link to="/staff/tasks" style={linkStyle}>
        <FaTasks /> {!collapsed && "Công việc"}
      </Link>
      <Link to="/staff/devices" style={linkStyle}>
        <FaDesktop /> {!collapsed && "Thiết bị cơ sở"}
      </Link>
      <Link to="/staff/reports" style={linkStyle}>
        <FaChartBar /> {!collapsed && "Báo cáo"}
      </Link>
      <Link to="/staff/users" style={linkStyle}>
        <FaUser /> {!collapsed && "Người dùng"}
      </Link>
      <Link to="/staff/history" style={linkStyle}>
        <FaHistory /> {!collapsed && "Lịch sử"}
      </Link>
    </div>
  );
}
