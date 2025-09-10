import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import {
  FaLaptop,
  FaDesktop,
  FaTabletAlt,
  FaServer,
  FaMobileAlt,
  FaQuestion,
  FaPaperPlane,
} from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const typeIcons = {
  Laptop: <FaLaptop size={20} color="#1976d2" />,
  Desktop: <FaDesktop size={20} color="#1976d2" />,
  Tablet: <FaTabletAlt size={20} color="#1976d2" />,
  Server: <FaServer size={20} color="#1976d2" />,
  Mobile: <FaMobileAlt size={20} color="#1976d2" />,
  default: <FaQuestion size={20} color="#1976d2" />,
};

const DevicesStaff = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ equipmentName: "", quantity: "", note: "" });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const { facilityId } = useOutletContext() || {};
  const requestedBy = "currentUserId"; // TODO: lấy từ auth

  // --- Lấy dữ liệu thiết bị theo facilityId ---
  useEffect(() => {
    const fetchDevices = async () => {
      if (!facilityId) return;
      setLoading(true);
      const q = query(
        collection(db, "equipmentFacilities"),
        where("facilityId", "==", facilityId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevices(data);
      setLoading(false);
    };
    fetchDevices();
  }, [facilityId]);

  const typeMap = devices.reduce((acc, device) => {
    if (!acc[device.type]) acc[device.type] = [];
    acc[device.type].push(device);
    return acc;
  }, {});

  const totalDevices = devices.length;

  // --- Gửi yêu cầu cấp phát ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      await addDoc(collection(db, "requests"), {
        requestType: "cap-phat",
        facilityId: facilityId || "",
        equipmentName: form.equipmentName,
        quantity: Number(form.quantity),
        note: form.note,
        createdAt: serverTimestamp(),
        status: "pending",
        requestedBy,
      });
      setMessage("Gửi yêu cầu thành công!");
      setTimeout(() => setMessage(""), 4000);
      setForm({ equipmentName: "", quantity: "", note: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setMessage("Gửi yêu cầu thất bại!");
      setTimeout(() => setMessage(""), 2000);
    }
    setSending(false);
  };

  // --- Styles ---
  if (loading) {
    return <div style={{ padding: 24 }}>Đang tải dữ liệu...</div>;
  }

  const cardStyle = {
    background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
    borderRadius: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    padding: 32,
    maxWidth: 1000,
    margin: "0 auto 40px",
  };

  const btnStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
  };

  const submitBtnStyle = {
    ...btnStyle,
    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
    color: "#fff",
  };

  const cancelBtnStyle = {
    ...btnStyle,
    background: "#f44336",
    color: "#fff",
  };

  const typeBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    border: "1px solid #1976d2",
    color: "#1976d2",
    background: "#e3f2fd",
    transition: "all 0.3s",
  };

  const typeBtnActive = {
    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(25,118,210,0.3)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 16,
  };

  const thStyle = {
    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
    color: "#fff",
    padding: "12px",
    borderRadius: 12,
    textAlign: "center",
  };

  const tdStyle = {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #e0e0e0",
    fontSize: 14,
  };

  const badgeStyle = {
    background: "#ff7043",
    color: "#fff",
    borderRadius: "50%",
    padding: "3px 10px",
    fontSize: 13,
    fontWeight: 700,
    marginLeft: 6,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  };

  const detailStyle = {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    padding: 24,
    marginTop: 24,
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #ccc",
    fontSize: 14,
    minWidth: 200,
    outline: "none",
  };

  const formStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    background: "#e3f2fd",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 24,
  };

  return (
    <div style={{ padding: 24 }}>
      {message && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "12px 20px",
            borderRadius: 12,
            background: message.includes("thành công") ? "#4caf50" : "#f44336",
            color: "#fff",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            transition: "all 0.3s",
          }}
        >
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: 24 }}>
          Danh sách thiết bị cơ sở
        </h2>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button
            style={{ ...submitBtnStyle, fontSize: 17 }}
            onClick={() => {
              setShowForm(true);
              setSelectedType(null);
            }}
          >
            <FaPaperPlane /> Gửi yêu cầu cấp phát thiết bị
          </button>
        </div>

        {showForm && (
          <form style={formStyle} onSubmit={handleSubmit}>
            <div>
              <label style={{ fontWeight: 500 }}>Tên thiết bị:</label>
              <br />
              <input
                style={inputStyle}
                type="text"
                required
                value={form.equipmentName}
                onChange={(e) =>
                  setForm({ ...form, equipmentName: e.target.value })
                }
                placeholder="VD: Laptop"
              />
            </div>
            <div>
              <label style={{ fontWeight: 500 }}>Số lượng:</label>
              <br />
              <input
                style={inputStyle}
                type="number"
                required
                min={1}
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
                placeholder="VD: 5"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500 }}>Lý do/Mô tả:</label>
              <br />
              <input
                style={{ ...inputStyle, width: "100%" }}
                type="text"
                required
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="VD: Cần cho nhân viên mới"
              />
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button style={submitBtnStyle} type="submit" disabled={sending}>
                <FaPaperPlane /> {sending ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
              <button
                style={cancelBtnStyle}
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ equipmentName: "", quantity: "", note: "" });
                  setMessage("");
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {!showForm && (
          <>
            <div style={{ fontSize: 17, marginBottom: 12 }}>
              Tổng số thiết bị: <b>{totalDevices}</b>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 500, marginRight: 12 }}>Phân loại:</span>
              {Object.keys(typeMap).map((type) => (
                <button
                  key={type}
                  style={{
                    ...typeBtnStyle,
                    ...(selectedType === type ? typeBtnActive : {}),
                  }}
                  onClick={() =>
                    setSelectedType(selectedType === type ? null : type)
                  }
                >
                  {typeIcons[type] || typeIcons.default} {type}{" "}
                  <span style={badgeStyle}>{typeMap[type].length}</span>
                </button>
              ))}
            </div>

            {selectedType && (
              <div style={detailStyle}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#1976d2",
                    marginBottom: 16,
                  }}
                >
                  {typeIcons[selectedType] || typeIcons.default} Thiết bị loại:{" "}
                  {selectedType}
                </h3>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Tên thiết bị</th>
                      <th style={thStyle}>CPU</th>
                      <th style={thStyle}>RAM</th>
                      <th style={thStyle}>VGA</th>
                      <th style={thStyle}>Số lượng</th>
                      <th style={thStyle}>Trạng thái</th>
                      <th style={thStyle}>Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeMap[selectedType].map((device) => {
                      const quantity = device.quantity || 0;
                      const used = device.used || 0;
                      const isFull = used >= quantity;

                      return (
                        <tr key={device.id}>
                          <td style={tdStyle}>{device.name}</td>
                          <td style={tdStyle}>{device.specs?.CPU}</td>
                          <td style={tdStyle}>{device.specs?.RAM}</td>
                          <td style={tdStyle}>{device.specs?.VGA}</td>
                          <td style={tdStyle}>{quantity}</td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: 12,
                                background: isFull ? "#ffebee" : "#e8f5e9",
                                color: isFull ? "#d32f2f" : "#388e3c",
                                fontWeight: 500,
                              }}
                            >
                              {isFull
                                ? "Hết"
                                : `Đang sử dụng ${used}/${quantity} máy`}
                            </span>
                          </td>
                          <td style={tdStyle}>{device.description}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DevicesStaff;
