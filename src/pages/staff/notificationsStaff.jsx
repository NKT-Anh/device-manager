import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { FaBell } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  padding: 28,
  maxWidth: 700,
  margin: "32px auto",
};

const itemStyle = (read) => ({
  background: read ? "#f5f5f5" : "#e3f2fd",
  borderRadius: 8,
  padding: "18px 16px",
  marginBottom: 18,
  boxShadow: read ? "none" : "0 2px 8px rgba(25,118,210,0.08)",
  display: "flex",
  alignItems: "center",
  gap: 16,
});

const titleStyle = {
  fontWeight: 600,
  fontSize: 17,
  color: "#1976d2",
};

const dateStyle = {
  fontSize: 13,
  color: "#888",
  marginTop: 4,
};

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate();
  return d.toLocaleString("vi-VN");
}

const NotificationsStaff = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { facilityId } = useOutletContext() || {};

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      let q = collection(db, "notifications");
      if (facilityId) {
        q = query(q, where("facilityId", "==", facilityId), orderBy("createdAt", "desc"));
      }
      const snap = await getDocs(q);
      setNotifications(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    };
    fetchNotifications();
  }, [facilityId]);

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: 24 }}>
        <FaBell style={{ marginRight: 8 }} />
        Thông báo từ quản lý
      </h2>
      {loading ? (
        <div style={{ textAlign: "center" }}>Đang tải...</div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>Không có thông báo nào.</div>
      ) : (
        notifications.map(n => (
          <div key={n.id} style={itemStyle(n.read)}>
            <FaBell size={22} color={n.read ? "#888" : "#1976d2"} />
            <div style={{ flex: 1 }}>
              <div style={titleStyle}>{n.title}</div>
              <div style={{ margin: "8px 0" }}>{n.message}</div>
              <div style={dateStyle}>{formatDate(n.createdAt)}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsStaff;