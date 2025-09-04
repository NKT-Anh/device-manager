import React from "react";

const users = [
  {
    stt: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    role: "Nhân viên",
    devices: ["Laptop Dell XPS", "Máy in HP"],
    reason: "Làm việc văn phòng, in tài liệu",
  },
  {
    stt: 2,
    name: "Trần Thị B",
    email: "b@gmail.com",
    role: "Quản lý",
    devices: ["Máy chiếu Epson"],
    reason: "Họp phòng ban",
  },
];

const UsersStaff = () => {
  return (
    <div>
      <h2>Danh sách người dùng & thiết bị đang sử dụng</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>STT</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Tên</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Vai trò</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Thiết bị đang dùng</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Lý do sử dụng</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.stt}>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{u.stt}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{u.name}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{u.email}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{u.role}</td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {u.devices.join(", ")}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>{u.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersStaff;