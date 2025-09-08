import React, { useState, useEffect } from "react";
import "../css/usersStaff.css";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const defaultForm = {
  name: "",
  email: "",
  role: "Nhân viên",
  devices: [],
  reason: "",
};

const equipmentCol = collection(db, "equipmentFacilities");

const UserAddModal = ({ form, setForm, onAdd, onCancel }) => {
  const [deviceInput, setDeviceInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allDevices, setAllDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const snap = await getDocs(equipmentCol);
      const list = snap.docs.map((doc) => ({
        deviceId: doc.id,
        deviceName: doc.data().name.toLowerCase(),
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

  const handleSelectDevice = async (device) => {
  const exists = form.devices.some((d) => d.deviceId === device.deviceId);
  if (exists) {
    Swal.fire({
      icon: "warning",
      title: "Thiết bị đã tồn tại",
      text: "Bạn đã thêm thiết bị này rồi!",
    });
    return;
  }

  // Kiểm tra số lượng trong kho
  if (device.deviceId) {
    const ref = doc(db, "equipmentFacilities", device.deviceId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      if (data.quantity <= 0) {
        Swal.fire({
          icon: "error",
          title: "Hết hàng",
          text: `Thiết bị "${data.name}" đã hết trong kho!`,
        });
        return;
      }
    }
  }

  setForm((f) => ({
    ...f,
    devices: [...f.devices, device],
  }));
  setDeviceInput("");
  setSuggestions([]);
  setShowSuggestions(false);
};

const handleAddManualDevice = async () => {
  if (!deviceInput.trim()) return;

  const exists = form.devices.some(
    (d) => d.deviceName.toLowerCase() === deviceInput.trim().toLowerCase()
  );
  if (exists) {
    Swal.fire({
      icon: "warning",
      title: "Thiết bị đã tồn tại",
      text: "Bạn đã thêm thiết bị này rồi!",
    });
    return;
  }

  // Tìm trong kho nếu có deviceId
  const deviceInStock = allDevices.find(
    (d) => d.deviceName.toLowerCase() === deviceInput.trim().toLowerCase()
  );

  if (deviceInStock?.deviceId) {
    const ref = doc(db, "equipmentFacilities", deviceInStock.deviceId);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().quantity <= 0) {
      Swal.fire({
        icon: "error",
        title: "Hết hàng",
        text: `Thiết bị "${deviceInStock.deviceName}" đã hết trong kho!`,
      });
      return;
    }
  }

  setForm((f) => ({
    ...f,
    devices: [
      ...f.devices,
      { deviceId: deviceInStock?.deviceId || null, deviceName: deviceInput.trim() },
    ],
  }));
  setDeviceInput("");
  setSuggestions([]);
  setShowSuggestions(false);
};

  return (
    <div className="users-modal-backdrop" onClick={onCancel}>
      <div
        className="users-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Thêm mới người dùng</h3>

        {/* Tên */}
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Nhập tên người dùng"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email / Liên hệ:</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Nhập email hoặc số điện thoại"
          />
        </div>

        {/* Vai trò */}
        <div className="form-group">
          <label>Vai trò:</label>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="Nhân viên">Nhân viên</option>
            <option value="Quản lý">Quản lý</option>
          </select>
        </div>

        {/* Thiết bị */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>Thiết bị:</label>
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

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-box">
              {suggestions.map((s) => (
                <li key={s.deviceId} onMouseDown={() => handleSelectDevice(s)}>
                  {s.deviceName}
                </li>
              ))}
            </ul>
          )}

          <div className="selected-devices">
            {form.devices.map((d, i) => (
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
          <label>Lý do sử dụng:</label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Nhập lý do sử dụng thiết bị"
          />
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-confirm" onClick={onAdd}>
            Thêm
          </button>
          <button
            className="btn-cancel"
            onClick={() => {
              setForm(defaultForm);
              onCancel();
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAddModal;
