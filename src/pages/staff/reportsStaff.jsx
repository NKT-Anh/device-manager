import React from "react";

const ReportsStaff = () => {
  return (
    <div>
      <h2>Báo cáo</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>STT</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Tiêu đề</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Ngày tạo</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>1</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Báo cáo thiết bị hỏng</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>01/09/2025</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Đã xử lý</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>2</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Báo cáo sự cố mạng</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>02/09/2025</td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>Đang xử lý</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportsStaff;