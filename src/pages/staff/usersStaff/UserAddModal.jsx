import React, { useState, useEffect } from "react";
import "../css/usersStaff.css";

const UserAddModal = ({ form, setForm, onAdd, onCancel }) => {
  const [deviceInput, setDeviceInput] = useState(form.devices.join(", "));

  useEffect(() => {
    setDeviceInput(form.devices.join(", "));
  }, [form.devices]);

  return (
    <div className="users-modal-backdrop" onClick={onCancel}>
      <div className="users-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Thêm mới người dùng</h3>

        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nhập tên người dùng"
          />
        </div>

        <div className="form-group">
          <label>Email / Liên hệ:</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Nhập email hoặc số điện thoại"
          />
        </div>

        <div className="form-group">
          <label>Vai trò:</label>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option>Nhân viên</option>
            <option>Quản lý</option>
          </select>
        </div>

        <div className="form-group">
          <label>Thiết bị đang dùng (cách nhau dấu phẩy):</label>
          <input
            type="text"
            value={deviceInput}
            onChange={(e) => setDeviceInput(e.target.value)}
            onBlur={() =>
              setForm((f) => ({
                ...f,
                devices: deviceInput
                  .split(",")
                  .map((d) => d.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Ví dụ: Laptop Dell, Máy in HP"
          />
        </div>

        <div className="form-group">
          <label>Lý do sử dụng:</label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Nhập lý do sử dụng thiết bị"
          />
        </div>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={onAdd}>
            Thêm
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAddModal;
