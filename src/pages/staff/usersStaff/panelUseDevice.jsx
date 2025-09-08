import React, { useState } from "react";
import UsersStaff from "./usersStaff";       // trang Active
import ReturnedDevices from "./returnedDevices"; // trang Returned

const PanelUseDevice = () => {
  const [activePage, setActivePage] = useState("active"); 

  return (
    <div style={{ width: "90%", margin: "0 auto", textAlign: "center" }}>
      {/* Menu / Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActivePage("active")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activePage === "active" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        >
          Đang sử dụng
        </button>
        <button
          onClick={() => setActivePage("returned")}
          style={{
            padding: "10px 20px",
            backgroundColor: activePage === "returned" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            minWidth: "120px",
          }}
        >
          Đã trả
        </button>
      </div>

      {/* Panel Content */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          textAlign: "left",
        }}
      >
        {activePage === "active" ? <UsersStaff /> : <ReturnedDevices />}
      </div>
    </div>
  );
};

export default PanelUseDevice;
