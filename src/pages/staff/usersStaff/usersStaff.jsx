import React, { useState, useEffect } from "react";
import "../css/usersStaff.css";
import UserDetailModal from "./UserDetailModal";
import UserEditModal from "./UserEditModal";
import UserAddModal from "./UserAddModal";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { db } from "../../../firebase/firebaseConfig";
import {
  createUserDevice,
  updateUserDevice,
  deleteUserDevice,
  userDevicesCol,
} from "../../../services/staff/userDevicesApi";
import { addDeviceHistory } from "../../../services/staff/deviceHistoryApi";
import { onSnapshot, query, orderBy, doc, updateDoc, increment, collection, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../context/authContext";
import ExportToExcel from "./exportToExcel";
import Loading from "../../../utils/loading";

const emptyForm = {
  name: "",
  email: "",
  role: "Nhân viên",
  devices: [],
  reason: "",
};

const UsersStaff = () => {
  const { user: currentUser } = useAuth(); 
  const facilityId = currentUser?.facilityId;

  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [returnModal, setReturnModal] = useState(false);
  const [returnUser, setReturnUser] = useState(null);
  const [selectedReturnDevices, setSelectedReturnDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lọc danh sách user đang dùng
  const activeUsers = users.filter(u => u.status === "active" || u.status === "Đang sử dụng") ;
  const getActiveDevices = (devices) => {
  return devices.filter(d => d.status !== "locked");
  };

    // --- phân trang ---
  const totalPages = Math.ceil(activeUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = activeUsers.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }
  // Fetch dữ liệu userDevices realtime
  useEffect(() => {
    if (!facilityId) return;
    const q = query(userDevicesCol, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.facilityId === facilityId);
      setUsers(list);
    });
    return () => unsubscribe();
  }, [facilityId]);

  if (!facilityId) {
    return (
      <div style={{ padding: 20, fontSize: 18, color: "#555" }}>
        Vui lòng cập nhật thông tin cá nhân để quản lý thiết bị.
      </div>
    );
  }

  // ---------- Thêm người dùng ----------
  const handleAdd = async () => {
    if (!addForm.name.trim()) {
      Swal.fire("Thiếu thông tin", "Vui lòng nhập tên người dùng!", "warning");
      return;
    }
    if (!addForm.devices || addForm.devices.length === 0) {
      Swal.fire("Thiếu thiết bị", "Vui lòng chọn ít nhất một thiết bị!", "warning");
      return;
    }

    try {
      const userData = { ...addForm, facilityId, status: "Đang sử dụng" };
      const res = await createUserDevice(userData);
      if (!res.success) throw new Error(res.message || "Không thể thêm user!");

      for (const d of addForm.devices) {
        if (d.deviceId) {
          await updateDoc(doc(db, "equipmentFacilities", d.deviceId), { quantity: increment(-1) });
        }
      }

      for (const d of addForm.devices) {
        await addDeviceHistory({
          name: addForm.name,
          email: addForm.email,
          role: addForm.role,
          deviceId: d.deviceId || null,
          deviceName: d.deviceName,
          facilityId,
          reason: addForm.reason || "Gán thiết bị mới",
          status: "Đang sử dụng",
        });
      }

      Swal.fire("Thành công", "Đã thêm người dùng", "success");
      setAddForm(emptyForm);
      setShowAdd(false);
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể thêm dữ liệu!", "error");
    }
  };

  // ---------- Sửa người dùng ----------
  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      devices: user.devices,
      reason: user.reason,
    });
  };

  const handleSave = async () => {
    const res = await updateUserDevice(editForm.id, editForm);
    if (res.success) {
      Swal.fire("Thành công", "Đã cập nhật người dùng!", "success");
      setEditUser(null);
    } else {
      Swal.fire("Lỗi", res.message || "Không thể cập nhật dữ liệu!", "error");
    }
  };

  // ---------- Xóa người dùng ----------
  const handleDelete = (user) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn có chắc chắn muốn xóa người dùng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      confirmButtonColor: "#e53935",
      cancelButtonColor: "#1976d2",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteUserDevice(user.id);
        if (res.success) Swal.fire("Đã xóa!", "Người dùng đã bị xóa.", "success");
        else Swal.fire("Lỗi", res.message || "Không thể xóa dữ liệu!", "error");
      }
    });
  };

  // ---------- Trả thiết bị ----------
  const handleOpenReturnModal = (user) => {
    setReturnUser(user);
    setSelectedReturnDevices([]);
    setReturnModal(true);
  };

  const toggleDeviceSelection = (deviceId) => {
    setSelectedReturnDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleConfirmReturn = async () => {
    if (!selectedReturnDevices.length) {
      Swal.fire("Thông báo", "Chưa chọn thiết bị nào để trả!", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Xác nhận trả máy",
      text: `Bạn có chắc chắn muốn trả ${selectedReturnDevices.length} thiết bị?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    });
    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      // 1️⃣ Cập nhật kho
      for (const d of returnUser.devices) {
        if (selectedReturnDevices.includes(d.deviceId) && d.deviceId) {
          await updateDoc(doc(db, "equipmentFacilities", d.deviceId), { quantity: increment(1) });
        }
      }

      // 2️⃣ Cập nhật deviceHistory
      for (const d of returnUser.devices) {
        if (selectedReturnDevices.includes(d.deviceId)) {
          const historyQuery = query(
            collection(db, "deviceHistory"),
            where("facilityId", "==", returnUser.facilityId),
            where("deviceId", "==", d.deviceId),
            where("status", "==", "Đang sử dụng")
          );
          const snapshot = await getDocs(historyQuery);
          snapshot.docs.forEach(async (docSnap) => {
            await updateDoc(doc(db, "deviceHistory", docSnap.id), {
              endDate: new Date(),
              status: "Đã thu hồi",
            });
          });
        }
      }

      // 3️⃣ Update userDevices: khóa thiết bị
      const updatedDevices = returnUser.devices.map(d =>
        selectedReturnDevices.includes(d.deviceId)
          ? { ...d, status: "locked" }
          : d
      );
      const remainingDevices = updatedDevices.filter(d => d.status !== "locked");
      const newUserStatus = remainingDevices.length === 0 ? "locked" : "Đang sử dụng";

      await updateDoc(doc(db, "userDevices", returnUser.id), {
        devices: updatedDevices,
        status: newUserStatus,
        updatedAt: serverTimestamp(),
      });

      Swal.fire("Thành công", "Thiết bị đã được trả!", "success");
      setReturnModal(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể trả thiết bị!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-container">
      {loading && <Loading message="Đang xử lý..." />}
      <h2 className="users-title">Danh sách người dùng & thiết bị đang sử dụng</h2>

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

      <ExportToExcel users={users} />

      <table className="users-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Liên hệ</th>
            <th>Vai trò</th>
            <th>Thiết bị đang dùng</th>
            <th>Lý do sử dụng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u, index) => (
            <tr key={u.id}>
              <td>{indexOfFirst + index + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {getActiveDevices(u.devices).map(d => d.deviceName).join(", ")}
              </td>
              <td>{u.reason}</td>
              <td>
                <div className="users-action-group">
                  <button className="users-action-btn" onClick={() => setSelected(u)} title="Xem chi tiết"><FaEye /></button>
                  <button className="users-action-btn edit" onClick={() => handleEdit(u)} title="Chỉnh sửa"><FaEdit /></button>
                  <button className="users-action-btn delete" onClick={() => handleDelete(u)} title="Xóa"><FaTrash /></button>
                  <button className="users-action-btn return" onClick={() => handleOpenReturnModal(u)} title="Trả máy">🡆</button>
                </div>
              </td>
            </tr>
          ))}
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
      {/* Modal trả thiết bị */}
      {returnModal && returnUser && (
        <div
          className="modal-backdrop"
          onClick={() => setReturnModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "25px 30px",
              width: "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
              Trả thiết bị của <span style={{ color: "#007BFF" }}>{returnUser.name}</span>
            </h3>

            <ul>
              {returnUser.devices
                ?.filter(d => d.status !== "locked")
                .map((d) => (
                  <li key={d.deviceId}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedReturnDevices.includes(d.deviceId)}
                        onChange={() => toggleDeviceSelection(d.deviceId)}
                      />
                      {d.deviceName}
                    </label>
                  </li>
                ))}
            </ul>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleConfirmReturn}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                  marginRight: "10px",
                }}
              >
                Xác nhận
              </button>
              <button
                onClick={() => setReturnModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <UserDetailModal user={selected} onClose={() => setSelected(null)} />
      {editUser && (
        <UserEditModal
          form={editForm}
          setForm={setEditForm}
          onSave={handleSave}
          onCancel={() => setEditUser(null)}
        />
      )}
      {showAdd && (
        <UserAddModal
          form={addForm}
          setForm={setAddForm}
          onAdd={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}
    </div>
  );
};

export default UsersStaff;
