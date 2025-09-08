import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import "./css/historyStaff.css";
import DeviceDetailModal from "./history/DeviceDetailModal";

const ITEMS_PER_PAGE = 10;

const DeviceHistory = () => {
  const { user } = useAuth();
  const facilityId = user?.facilityId;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDeviceModal, setOpenDeviceModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    if (timestamp.seconds !== undefined) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString("vi-VN");
    }
    return timestamp;
  };

  // sắp xếp
  const sortedHistory = React.useMemo(() => {
    let sortable = [...history];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal?.seconds) aVal = aVal.seconds * 1000;
        if (bVal?.seconds) bVal = bVal.seconds * 1000;
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [history, sortConfig]);

  // phân trang
  const totalPages = Math.ceil(sortedHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = sortedHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // load data
  useEffect(() => {
    if (!facilityId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const historyCol = collection(db, "deviceHistory");
    const q = query(historyCol, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          devices: Array.isArray(doc.data().devices) ? doc.data().devices : [],
          ...doc.data(),
        }))
        .filter((item) => item.facilityId === facilityId);

      setHistory(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [facilityId]);

  if (!user) return <div style={{ padding: 20 }}>Đang load thông tin người dùng...</div>;
  if (!facilityId) return <div style={{ padding: 20 }}>Vui lòng cập nhật thông tin cá nhân để xem lịch sử.</div>;
  if (loading) return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử sử dụng thiết bị</h2>
      <table className="history-table">
        <thead>
          <tr>
            {[
              { key: "stt", label: "STT" },
              { key: "deviceName", label: "Thiết bị" },
              { key: "name", label: "Người dùng" },
              { key: "email", label: "Liên hệ" },
              { key: "status", label: "Trạng thái" },
              { key: "updatedAt", label: "Cập nhật lúc" },
              { key: "action", label: "Hành động" },
            ].map((col) => (
              <th
                key={col.key}
                onClick={() =>
                  col.key !== "stt" && col.key !== "action" && requestSort(col.key)
                }
                style={{ cursor: col.key !== "stt" && col.key !== "action" ? "pointer" : "default" }}
              >
                {col.label}{" "}
                {sortConfig.key === col.key && (
                  <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.length ? (
            currentData.map((h, index) => (
              <tr key={h.id}>
                <td>{startIndex + index + 1}</td>
                <td>{h.deviceName || "-"}</td>
                <td>{h.name || "-"}</td>
                <td>{h.email || "-"}</td>
                <td>
                  <div
                    className={`status-box ${
                      !h.endDate || h.status === "active" ? "active" : "locked"
                    }`}
                  >
                    {!h.endDate || h.status === "active" ? "Đang sử dụng" : "Đã thu hồi"}
                  </div>
                </td>
                <td>{formatDate(h.updatedAt)}</td>
                <td>
                  <button className="btn-detail" onClick={() => setSelectedRecord(h)}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                Không có dữ liệu lịch sử.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ marginRight: 8 }}
          >
            « Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              style={{
                margin: "0 4px",
                fontWeight: currentPage === i + 1 ? "bold" : "normal",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ marginLeft: 8 }}
          >
            Sau »
          </button>
        </div>
      )}

      {/* Modal chi tiết */}
      {selectedRecord && (
        <div className="modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "600px",
              maxWidth: "90%",
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>
              Chi tiết lịch sử sử dụng
            </h3>

            <div style={{ display: "flex", gap: "20px" }}>
              {/* Card Người dùng */}
              <div
                style={{
                  flex: 1,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#333" }}>👤 Người dùng</h4>
                <p><b>Người dùng : </b> {selectedRecord.name}</p>
                <p><b>Email:</b> {selectedRecord.email}</p>
                <p><b>Lý do:</b> {selectedRecord.reason || "-"}</p>
              </div>

              {/* Card Thiết bị */}
              <div
                style={{
                  flex: 1,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#333" }}>💻 Thiết bị</h4>
                <p><b>Tên thiết bị:</b> {selectedRecord.deviceName}</p>
                <p><b>Ngày bắt đầu:</b> {formatDate(selectedRecord.startDate)}</p>
                <p><b>Ngày kết thúc:</b> {formatDate(selectedRecord.endDate)}</p>
                <p>
                  <b>Trạng thái:</b>{" "}
                  {!selectedRecord.endDate || selectedRecord.status === "active"
                    ? "Đang sử dụng"
                    : "Đã thu hồi"}
                </p>
                <p><b>Cập nhật lúc:</b> {formatDate(selectedRecord.updatedAt)}</p>
                <button
                  onClick={() => {
                    setSelectedDeviceId(selectedRecord.deviceId);
                    setOpenDeviceModal(true);
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#007bff",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Xem chi tiết thiết bị
                </button>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{
                  padding: "10px 20px",
                  background: "#dc3545",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>

            {openDeviceModal && (
              <DeviceDetailModal
                isOpen={openDeviceModal}
                deviceId={selectedDeviceId}
                onClose={() => setOpenDeviceModal(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceHistory;
