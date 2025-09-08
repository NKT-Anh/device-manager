import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function ProfileScreen() {
  const { user, updateUser } = useAuth(); 
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [selectedFacilityId, setSelectedFacilityId] = useState(user?.facilityId || "");
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "facilities"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFacilities(list);
      } catch (err) {
        console.error("Lấy cơ sở thất bại:", err);
        Swal.fire({
          icon: "error",
          title: "Lấy cơ sở thất bại",
          text: err.message || "Có lỗi xảy ra",
        });
      }
    };
    fetchFacilities();
  }, []);

  const facility = facilities.find(f => f.id === selectedFacilityId);

  const handleSave = async () => {
    if (!name || !email) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng điền đầy đủ tên và email!",
      });
      return;
    }

    setLoading(true);
    try {
      await updateUser({
        name,
        email,
        facilityId: selectedFacilityId || null,
      });
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại!",
        text: err.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Thông tin cá nhân</h2>
      <div style={styles.field}>
        <label>Tên:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={styles.field}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={styles.field}>
        <label>Cơ sở:</label>
        {user?.facilityId ? (
          <p>{facility ? facility.name : "Chưa có cơ sở"}</p>
        ) : (
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
          >
            <option value="">-- Chọn cơ sở --</option>
            {facilities.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.address})
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={styles.buttons}>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "20px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  field: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "column",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
};
