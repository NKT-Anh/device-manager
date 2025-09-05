import React from "react";
import "../css/usersStaff.css";

const UserEditModal = ({ form, setForm, onSave, onCancel }) => (
  <div className="users-modal-backdrop" onClick={onCancel}>
    <div className="users-modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>Chỉnh sửa người dùng</h3>

      <div className="form-group">
        <label htmlFor="name">Tên:</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Vai trò:</label>
        <select
          id="role"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
        >
          <option>Nhân viên</option>
          <option>Quản lý</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="devices">Thiết bị đang dùng (cách nhau dấu phẩy):</label>
        <input
          id="devices"
          type="text"
          value={form.devices.join(", ")}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              devices: e.target.value
                .split(",")
                .map((d) => d.trim())
                .filter(Boolean),
            }))
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="reason">Lý do sử dụng:</label>
        <textarea
          id="reason"
          rows="3"
          value={form.reason}
          onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
        />
      </div>

      <div className="modal-actions">
        <button className="btn-save" onClick={onSave}>Lưu</button>
        <button className="btn-cancel" onClick={onCancel}>Hủy</button>
      </div>
    </div>
  </div>
);

export default UserEditModal;
