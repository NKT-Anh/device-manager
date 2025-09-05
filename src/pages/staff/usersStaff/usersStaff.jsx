import React, { useState, useEffect } from "react";
import "../css/usersStaff.css";
import UserDetailModal from "./UserDetailModal";
import UserEditModal from "./UserEditModal";
import UserAddModal from "./UserAddModal";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  createUserDevice,
  updateUserDevice,
  deleteUserDevice,
  userDevicesCol,
} from "../../../services/staff/userDevicesApi";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "../../../context/authContext";

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


  const handleAdd = async () => {
    const dataToAdd = { ...addForm, facilityId };
    const res = await createUserDevice(dataToAdd);

    if (res.success) {
      Swal.fire("Thành công", "Đã thêm người dùng mới!", "success");
      setAddForm(emptyForm);
      setShowAdd(false);
    } else {
      Swal.fire("Lỗi", res.message || "Không thể thêm dữ liệu!", "error");
    }
  };


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
        if (res.success) {
          Swal.fire("Đã xóa!", "Người dùng đã bị xóa.", "success");
        } else {
          Swal.fire("Lỗi", res.message || "Không thể xóa dữ liệu!", "error");
        }
      }
    });
  };

  return (
    <div className="users-container">
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
          {users.map((u, index) => (
            <tr key={u.id}>
              <td>{index + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
             <td>{u.devices?.map(d => d.deviceName || d)?.join(", ") || "Chưa có"}</td>
              <td>{u.reason}</td>
              <td>
                <div className="users-action-group">
                  <button
                    className="users-action-btn"
                    onClick={() => setSelected(u)}
                    title="Xem chi tiết"
                  >
                    <FaEye />
                  </button>

                  <button
                    className="users-action-btn edit"
                    onClick={() => handleEdit(u)}
                    title="Chỉnh sửa"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="users-action-btn delete"
                    onClick={() => handleDelete(u)}
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
