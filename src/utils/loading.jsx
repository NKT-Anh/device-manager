// Loading.jsx
import React from "react";

export default function Loading({ message = "Đang tải..." }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          border: "6px solid #f3f3f3",
          borderTop: "6px solid #007bff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          animation: "spin 1s linear infinite",
          marginBottom: "15px",
        }}
      ></div>
      <span style={{ color: "#fff", fontSize: "18px" }}>{message}</span>

      {/* CSS animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
