import React from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function StaffHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/staff/profile");
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
        Swal.fire({
          icon: 'success',
          title: 'Đăng xuất thành công',
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div style={styles.header}>
      <div style={styles.userInfo} onClick={handleProfile}>
        <FaUserCircle size={24} style={{ marginRight: 8 }} />
        <span>{user?.name || "Staff"}</span>
      </div>
      <button style={styles.logoutBtn} onClick={handleLogout}>
        <FaSignOutAlt size={20} style={{ marginRight: 4 }} />
        Đăng xuất
      </button>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e53935",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
