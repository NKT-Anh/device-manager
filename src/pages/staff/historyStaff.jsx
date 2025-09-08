import React, { useState } from "react";
import "./css/historyStaff.css";

const initialData = [
  {
    stt: 1,
    user: "Nguyễn Khang Thái Anh",
    device: "Laptop Dell XPS",
    borrowDate: "2025-09-01",
    returnDate: "2025-09-03",
    status: "Đã trả",
    detail: "Cấu hình: i7, 16GB RAM, SSD 512GB. Mục đích: Làm việc văn phòng.",
  },
  {
    stt: 2,
    user: "Nguyễn Khang Thái",
    device: "Máy chiếu Epson",
    borrowDate: "2025-09-02",
    returnDate: "",
    status: "Đang sử dụng",
    detail: "Dùng cho phòng họp số 2. Đã kiểm tra trước khi mượn.",
  },
  {
    stt: 3,
    user: "Khang Thái Anh",
    device: "Router Wifi",
    borrowDate: "2025-09-03",
    returnDate: "",
    status: "Đang sử dụng",
    detail: "Router dùng cho phòng lab. Đã cấu hình sẵn.",
  },
];

const emptyForm = {
  user: "",
  device: "",
  borrowDate: "",
  returnDate: "",
  status: "Đang sử dụng",
  detail: "",
};

const HistoryStaff = () => {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);

  // Thêm mới
  const handleAdd = () => {
    const newStt = data.length > 0 ? Math.max(...data.map(d => d.stt)) + 1 : 1;
    setData([...data, { ...addForm, stt: newStt }]);
    setAddForm(emptyForm);
    setShowAdd(false);
  };

  // Sửa
  const handleEdit = (row) => {
    setEditRow(row);
    setEditForm({
      user: row.user,
      device: row.device,
      borrowDate: row.borrowDate,
      returnDate: row.returnDate,
      status: row.status,
      detail: row.detail,
    });
  };

  const handleSave = () => {
    setData((prev) =>
      prev.map((row) =>
        row.stt === editRow.stt ? { ...row, ...editForm } : row
      )
    );
    setEditRow(null);
  };

  // Xóa
  const handleDelete = (row) => {
    if (window.confirm("Bạn có chắc muốn xóa bản ghi này?")) {
      setData(data.filter(d => d.stt !== row.stt));
    }
  };

  return (
    <div className="history-container">
      <h2 className="history-title">Lịch sử sử dụng thiết bị</h2>
      <button
        style={{
          marginBottom: 16,
          padding: "6px 16px",
          borderRadius: 4,
          border: "none",
          background: "#1976d2",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => setShowAdd(true)}
      >
        + Thêm mới
      </button>
      <table className="history-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Người mượn</th>
            <th>Thiết bị</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.stt}>
              <td>{row.stt}</td>
              <td>{row.user}</td>
              <td>{row.device}</td>
              <td>{row.borrowDate}</td>
              <td>{row.returnDate || "-"}</td>
              <td>{row.status}</td>
              <td>
                <button
                  style={{
                    padding: "4px 12px",
                    borderRadius: 4,
                    border: "1px solid #1976d2",
                    background: "#fff",
                    color: "#1976d2",
                    cursor: "pointer",
                    marginRight: 8,
                  }}
                  onClick={() => setSelected(row)}
                >
                  Xem chi tiết
                </button>
              </td>
              <td>
                <button
                  style={{
                    padding: "4px 12px",
                    borderRadius: 4,
                    border: "1px solid #ffa726",
                    background: "#fff",
                    color: "#ffa726",
                    cursor: "pointer",
                    marginRight: 8,
                  }}
                  onClick={() => handleEdit(row)}
                >
                  Chỉnh sửa
                </button>
                <button
                  style={{
                    padding: "4px 12px",
                    borderRadius: 4,
                    border: "1px solid #e53935",
                    background: "#fff",
                    color: "#e53935",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(row)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal xem chi tiết */}
      {selected && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Chi tiết thiết bị</h3>
            <p><b>Người mượn:</b> {selected.user}</p>
            <p><b>Thiết bị:</b> {selected.device}</p>
            <p><b>Ngày mượn:</b> {selected.borrowDate}</p>
            <p><b>Ngày trả:</b> {selected.returnDate || "-"}</p>
            <p><b>Trạng thái:</b> {selected.status}</p>
            <p><b>Ghi chú:</b> {selected.detail}</p>
            <button
              style={{
                marginTop: 12,
                padding: "6px 16px",
                borderRadius: 4,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setSelected(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {editRow && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setEditRow(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 340,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Chỉnh sửa thông tin</h3>
            <div style={{ marginBottom: 12 }}>
              <label>Người mượn:</label>
              <input
                value={editForm.user}
                onChange={e => setEditForm(f => ({ ...f, user: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Thiết bị:</label>
              <input
                value={editForm.device}
                onChange={e => setEditForm(f => ({ ...f, device: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Ngày mượn:</label>
              <input
                type="date"
                value={editForm.borrowDate}
                onChange={e => setEditForm(f => ({ ...f, borrowDate: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Ngày trả:</label>
              <input
                type="date"
                value={editForm.returnDate}
                onChange={e => setEditForm(f => ({ ...f, returnDate: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Trạng thái:</label>
              <select
                value={editForm.status}
                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              >
                <option>Đang sử dụng</option>
                <option>Đã trả</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Ghi chú:</label>
              <textarea
                value={editForm.detail}
                onChange={e => setEditForm(f => ({ ...f, detail: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <button
              style={{
                marginRight: 8,
                padding: "6px 16px",
                borderRadius: 4,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={handleSave}
            >
              Lưu
            </button>
            <button
              style={{
                padding: "6px 16px",
                borderRadius: 4,
                border: "none",
                background: "#aaa",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setEditRow(null)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Modal thêm mới */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 340,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              position: "relative",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>Thêm mới lịch sử sử dụng</h3>
            <div style={{ marginBottom: 12 }}>
              <label>Người mượn:</label>
              <input
                value={addForm.user}
                onChange={e => setAddForm(f => ({ ...f, user: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Thiết bị:</label>
              <input
                value={addForm.device}
                onChange={e => setAddForm(f => ({ ...f, device: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Ngày mượn:</label>
              <input
                type="date"
                value={addForm.borrowDate}
                onChange={e => setAddForm(f => ({ ...f, borrowDate: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Ngày trả:</label>
              <input
                type="date"
                value={addForm.returnDate}
                onChange={e => setAddForm(f => ({ ...f, returnDate: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Trạng thái:</label>
              <select
                value={addForm.status}
                onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              >
                <option>Đang sử dụng</option>
                <option>Đã trả</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Ghi chú:</label>
              <textarea
                value={addForm.detail}
                onChange={e => setAddForm(f => ({ ...f, detail: e.target.value }))}
                style={{ width: "100%", padding: 6, marginTop: 4 }}
              />
            </div>
            <button
              style={{
                marginRight: 8,
                padding: "6px 16px",
                borderRadius: 4,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={handleAdd}
            >
              Thêm
            </button>
            <button
              style={{
                padding: "6px 16px",
                borderRadius: 4,
                border: "none",
                background: "#aaa",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setShowAdd(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryStaff;