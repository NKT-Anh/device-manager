import React, { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "../css/modal.css";
import DeviceReportModal from "../../staff/deviceReportModal";
const DeviceDetailModal = ({ isOpen, deviceId, onClose }) => {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
const [isReportOpen, setIsReportOpen] = useState(false);
  useEffect(() => {
    if (!isOpen || !deviceId) return;

    const fetchDevice = async () => {
      console.log("Fetching device with ID:", deviceId);
      setLoading(true);
      try {
        const ref = doc(db, "equipmentFacilities", deviceId);   

        const snap = await getDoc(ref);
        if (snap.exists()) {
          setDevice({ id: snap.id, ...snap.data() });
          const deviceData = snap.data();
          console.log("Facility ID:", deviceData.facilityId);
    return deviceData.facilityId;
        } else {
          setDevice(null);
        }
      } catch (err) {
        console.error("Lỗi khi load thiết bị:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevice();
  }, [isOpen, deviceId]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <p>Đang tải chi tiết thiết bị...</p>
        ) : device ? (
          <>
            <h2>💻 {device.name}</h2>
            {/* <p><b>ID:</b> {device.type}</p> */}
            <p><b>Loại:</b> {device.type}</p>
            {/* <p><b>Số lượng:</b> {device.quantity}</p> */}
            {/* <p><b>Trạng thái:</b> {device.status}</p> */}
            <p><b>Mô tả:</b> {device.description || "Không có mô tả"}</p>

            <h3>Thông số kỹ thuật</h3>
            {console.log("specs:", device)}
            {device.specs && typeof device.specs === "object" ? (
            <ul>
            {device?.specs ? (
                Object.entries(device.specs).map(([key, val]) => (
                <li key={key}>
                    <b>{key}:</b> {val}
                </li>
                ))
            ) : (
                <li>Không có thông số kỹ thuật</li>
            )}
            </ul>
            ) : (
            <p>Không có thông số kỹ thuật</p>
            )}
          </>
        ) : (
          <p>❌ Không tìm thấy thiết bị.</p>
        )}
        <button
          onClick={() => setIsReportOpen(true)}

          style={{
            background: "#ffc107",
            border: "none",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
                    {/* {console.log("deviceId in detail modal:", device.id)} */}
          📝 Báo cáo sự cố
        </button>
        <button className="btn-close" onClick={onClose}>
          Đóng
        </button>
{device && (
  <DeviceReportModal
    isOpen={isReportOpen}
     deviceId={deviceId || ""}   
    facilityId={device?.facilityId }
    onClose={() => setIsReportOpen(false)}
  />
)}
      </div>
    </div>
  );
};

export default DeviceDetailModal;
