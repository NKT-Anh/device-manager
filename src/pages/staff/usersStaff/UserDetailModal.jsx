import React from "react";
import "../css/usersStaff.css";

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="users-modal-backdrop" onClick={onClose}>
      <div className="users-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Chi tiết người dùng</h3>

        <div className="detail-item">
          <span className="label">Tên:</span>
          <span className="value">{user.name}</span>
        </div>

        <div className="detail-item">
          <span className="label">Liên hệ:</span>
          <span className="value">{user.email}</span>
        </div>

        <div className="detail-item">
          <span className="label">Vai trò:</span>
          <span className="value">{user.role}</span>
        </div>

        <div className="detail-item">
          <span className="label">Thiết bị đang dùng:</span>
          <span className="value">{user.devices?.join(", ") || "Không có"}</span>
        </div>

        <div className="detail-item">
          <span className="label">Lý do sử dụng:</span>
          <span className="value">{user.reason || "Không có"}</span>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
