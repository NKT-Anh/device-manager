import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../css/usersStaff.css";

const ITEMS_PER_PAGE = 10; // mỗi trang 10 dòng

const ReturnedDevices = () => {
  const [returnedUsers, setReturnedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReturnedUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "userDevices"));
      const users = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.devices.some(d => d.status === "locked")); // chỉ lấy thiết bị đã khóa
      setReturnedUsers(users);
    };

    fetchReturnedUsers();
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(returnedUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = returnedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="users-container">
      <h2>Danh sách thiết bị đã trả</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Role</th>
            <th>Thiết bị</th>
            <th>Lý do</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((u, index) => (
            <tr key={u.id}>
              <td>{startIndex + index + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.devices
                  .filter(d => d.status === "locked")
                  .map(d => d.deviceName)
                  .join(", ")}
              </td>
              <td>{u.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination" style={{ marginTop: 16, textAlign: "center" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          style={{ margin: "0 4px" }}
        >
          ◀ Trước
        </button>
        <span style={{ margin: "0 8px" }}>
          Trang {currentPage}/{totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          style={{ margin: "0 4px" }}
        >
          Sau ▶
        </button>
      </div>
    </div>
  );
};

export default ReturnedDevices;
