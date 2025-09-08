import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const DeviceReportModal = ({ isOpen, deviceId, facilityId, onClose }) => {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng nhập mô tả sự cố",
        confirmButtonText: "Đóng",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "deviceReports"), {
        deviceId,
        facilityId,
        reporterId: user?.uid || "",
        reporterName: user?.displayName || user?.email || "Không rõ",
        description,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "Báo cáo đã được gửi thành công",
        confirmButtonText: "OK",
      });

      onClose();
      setDescription("");
    } catch (err) {
      console.error("Lỗi khi gửi báo cáo:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi khi gửi báo cáo",
        text: err.message,
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h3>📝 Báo cáo sự cố thiết bị</h3>
        <textarea
          rows={5}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          placeholder="Nhập mô tả sự cố..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ textAlign: "right" }}>
          <button
            onClick={onClose}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceReportModal;
