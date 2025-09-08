import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffHeader from "./StaffHeader";
import SidebarStaff from "./SidebarStaff";
import { useAuth } from "../../context/authContext";

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

const layoutStyle = { display: "flex" };

const contentStyle = {
  flex: 1,
  padding: 32,
  background: "#fafbfc",
  minHeight: "calc(100vh - 60px)",
};

export default function LayoutStaff() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div>
      {/* Header chính */}
      <StaffHeader />

      {/* Thanh header phụ với toggle sidebar */}
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
        >
          {collapsed ? "☰" : "✖"}
        </button>
        Trang chủ nhân viên
      </div>

      {/* Layout chính */}
      <div style={layoutStyle}>
        {/* Sidebar */}
        <SidebarStaff collapsed={collapsed} />

        {/* Nội dung chính */}
        <div style={contentStyle}>
          {/* Truyền facilityId xuống các route con */}
          <Outlet context={{ facilityId: user?.facilityId }} />
        </div>
      </div>
    </div>
  );
}
