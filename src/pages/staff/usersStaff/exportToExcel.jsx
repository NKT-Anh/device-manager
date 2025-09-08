import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const ExportToExcel = ({ users }) => {
  const handleExport = () => {
    if (!users || users.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất!", "info");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      users.map((u, index) => ({
        STT: index + 1,
        Tên: u.name,
        Liên_hệ: u.email,
        Vai_trò: u.role,
        Thiết_bị: u.devices?.map(d => d.deviceName || d).join(", "),
        Lý_do: u.reason,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "Danh_sach_nguoi_dung.xlsx"
    );
  };

  return (
    <button
      style={{
        marginBottom: 16,
        marginLeft: 8,
        padding: "6px 16px",
        borderRadius: 4,
        border: "none",
        background: "#43a047",
        color: "#fff",
        cursor: "pointer",
      }}
      onClick={handleExport}
    >
      ⬇ Xuất Excel
    </button>
  );
};

export default ExportToExcel;
