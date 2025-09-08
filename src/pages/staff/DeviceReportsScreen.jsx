import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import "./css/DeviceReportsScreen.css";

const STATUS_COLORS = {
  pending: "#FFA500", // cam
  done: "#4CAF50", // xanh
  rejected: "#F44336", // đỏ
};
const STATUS_LABELS = {
  pending: "Đang chờ",
  done: "Hoàn thành",
  rejected: "Bị từ chối",
};

const DeviceReportsScreen = () => {
  const { user } = useAuth();
  const facilityId = user?.facilityId;

  const [reports, setReports] = useState([]);
  const [devicesMap, setDevicesMap] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!facilityId) return;

    const reportsCol = collection(db, "deviceReports");

    const unsubscribe = onSnapshot(
      reportsCol,
      async (snapshot) => {
        const allReports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const facilityReports = allReports
          .filter((report) => report.facilityId === facilityId)
          .sort(
            (a, b) =>
              (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          );

        setReports(facilityReports);

        // load device names
        const unknownDeviceIds = facilityReports
          .map((r) => r.deviceId)
          .filter((id) => id && !devicesMap[id]);

        if (unknownDeviceIds.length > 0) {
          const newMap = { ...devicesMap };
          await Promise.all(
            unknownDeviceIds.map(async (deviceId) => {
              try {
                const docRef = doc(db, "equipmentFacilities", deviceId);
                const docSnap = await getDoc(docRef);
                newMap[deviceId] = docSnap.exists()
                  ? docSnap.data().name
                  : "Chưa có tên";
              } catch (err) {
                console.error("Lỗi fetch tên thiết bị:", err);
                newMap[deviceId] = "Lỗi";
              }
            })
          );
          setDevicesMap(newMap);
        }
      },
      (error) => {
        console.error("Lỗi fetch reports:", error);
      }
    );

    return () => unsubscribe();
  }, [facilityId, devicesMap]);

  const filteredReports =
    filterStatus === "all"
      ? reports
      : reports.filter((r) => r.status === filterStatus);

  return (
    <div className="reports-container">
      <h2 className="reports-title">Báo cáo thiết bị</h2>

      <div className="reports-filter">
        <label>Trạng thái: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Đang chờ</option>
          <option value="done">Hoàn thành</option>
          <option value="rejected">Bị từ chối</option>
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <p className="no-reports">Không có báo cáo nào.</p>
      ) : (
        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Thiết bị</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Ngày báo cáo</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{devicesMap[report.deviceId] || "Đang tải..."}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[report.status] || "#ccc",
                      }}
                    >
                      {STATUS_LABELS[report.status] || report.status}
                    </span>
                  </td>
                  <td>{report.description || "-"}</td>
                  <td>
                    {report.createdAt
                      ? new Date(report.createdAt.seconds * 1000).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeviceReportsScreen;
