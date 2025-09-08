import React, { useState } from "react";
import DeviceDetailModal from "./DeviceDetailModal";
import "../css/modal.css";

const HistoryDetailModal = ({ isOpen, history, onClose }) => {
  const [openDeviceModal, setOpenDeviceModal] = useState(false);

  if (!isOpen || !history) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Chi tiết lịch sử</h2>
        <p><b>Người dùng:</b> {history.name}</p>
        <p><b>Email:</b> {history.email}</p>
        <p><b>Thiết bị:</b> {history.deviceName}</p>
        <p><b>Trạng thái:</b> {history.status}</p>
        <p><b>Cập nhật lúc:</b> {new Date(history.updatedAt?.seconds * 1000).toLocaleString()}</p>

        <div style={{ marginTop: 15 }}>
          <button className="btn-detail" onClick={() => setOpenDeviceModal(true)}>
            Xem chi tiết thiết bị
          </button>
          <button className="btn-close" onClick={onClose}>
            Đóng
          </button>
        </div>

        {openDeviceModal && (
          <DeviceDetailModal
            isOpen={openDeviceModal}
            deviceId={history.deviceId}
            onClose={() => setOpenDeviceModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HistoryDetailModal;
