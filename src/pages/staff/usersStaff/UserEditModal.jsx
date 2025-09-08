import React, { useState, useEffect } from "react";
import "../css/usersStaff.css";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
const equipmentCol = collection(db, "equipmentFacilities");

const UserEditModal = ({ form, setForm, onSave, onCancel }) => {
  const [deviceInput, setDeviceInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const snap = await getDocs(equipmentCol);
      const list = snap.docs.map((doc) => ({
        deviceId: doc.id,
        deviceName: doc.data().name,
      }));
      setAllDevices(list);
    };
    fetchDevices();
  }, []);

  const removeAccents = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const searchDevices = (keyword) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }
    const normalizedKey = removeAccents(keyword);
    const filtered = allDevices.filter((d) =>
      removeAccents(d.deviceName).includes(normalizedKey)
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectDevice = (device) => {
    // Check trùng
    const exists = form.devices.some((d) => d.deviceName === device.deviceName);
    if (exists) {
      Swal.fire({
      icon: "warning",
      title: "Thiết bị đã tồn tại",
      text: "Bạn đã thêm thiết bị này rồi!",
      confirmButtonText: "OK"
    });
      return;
    }

    setForm((f) => ({
      ...f,
      devices: [...f.devices, device],
    }));
    setDeviceInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddManualDevice = () => {
    if (!deviceInput.trim()) return;

    const exists = form.devices.some(
      (d) => d.deviceName.toLowerCase() === deviceInput.trim().toLowerCase()
    );
    if (exists) {
      alert("Thiết bị này đã được thêm!");
      return;
    }

    setForm((f) => ({
      ...f,
      devices: [...f.devices, { deviceId: null, deviceName: deviceInput.trim() }],
    }));
    setDeviceInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };


  return (
    <div className="users-modal-backdrop" onClick={onCancel}>
      <div className="users-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Chỉnh sửa người dùng</h3>

        {/* Tên */}
        <div className="form-group">
          <label htmlFor="name">Tên:</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        {/* Vai trò */}
        <div className="form-group">
          <label htmlFor="role">Vai trò:</label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="Nhân viên">Nhân viên</option>
            <option value="Quản lý">Quản lý</option>
          </select>
        </div>

        {/* Thiết bị */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>Thiết bị đang dùng:</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={deviceInput}
              onChange={(e) => {
                setDeviceInput(e.target.value);
                searchDevices(e.target.value);
              }}
              onFocus={() => searchDevices(deviceInput)}
              placeholder="Nhập tên thiết bị..."
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn-add-device"
              onClick={handleAddManualDevice}
            >
              ➕ Thêm
            </button>
          </div>

          {/* Dropdown gợi ý */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-box">
              {suggestions.map((s) => (
                <li key={s.deviceId} onMouseDown={() => handleSelectDevice(s)}>
                  {s.deviceName}
                </li>
              ))}
            </ul>
          )}

          {/* Danh sách đã chọn */}
          <div className="selected-devices">
            {form.devices?.filter(d => d.status !== "locked").map((d, i) => (
              <div key={i} className="device-chip">
                {d.deviceName}
                <span
                  className="chip-remove"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      devices: f.devices.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  ✖
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lý do */}
        <div className="form-group">
          <label htmlFor="reason">Lý do sử dụng:</label>
          <textarea
            id="reason"
            rows="3"
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
          />
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-save" onClick={onSave}>
            Lưu
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
