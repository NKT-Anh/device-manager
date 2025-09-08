import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAllUserDevices,
  createUserDevice,
  updateUserDevice,
  deleteUserDevice,
  getUserDeviceById,
} from "../services/staff/userDevicesApi"; // đường dẫn đổi theo project của bạn

const UserDevicesContext = createContext();
export const useUserDevices = () => useContext(UserDevicesContext);

export const UserDevicesProvider = ({ children, facilityId }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy danh sách userDevices khi mount
  const fetchUserDevices = async () => {
    setLoading(true);
    const result = await getAllUserDevices(facilityId);
    if (result.success) {
      setDevices(result.data);
    } else {
      console.error(result.message);
    }
    setLoading(false);
  };

    useEffect(() => {
    if (facilityId) {
        fetchUserDevices();
    } else {
        setDevices([]); // clear nếu chưa chọn cơ sở
    }
    }, [facilityId]);

  // 🔹 CRUD handler
  const addUserDevice = async (data) => {
    const res = await createUserDevice(data);
    if (res.success) {
      fetchUserDevices(); // refresh lại
    }
    return res;
  };

  const editUserDevice = async (id, data) => {
    const res = await updateUserDevice(id, data);
    if (res.success) {
      fetchUserDevices();
    }
    return res;
  };

  const removeUserDevice = async (id) => {
    const res = await deleteUserDevice(id);
    if (res.success) {
      setDevices((prev) => prev.filter((d) => d.id !== id));
    }
    return res;
  };

  const getById = async (id) => {
    return await getUserDeviceById(id);
  };

  return (
    <UserDevicesContext.Provider
      value={{
        devices,
        loading,
        fetchUserDevices,
        addUserDevice,
        editUserDevice,
        removeUserDevice,
        getById,
      }}
    >
      {children}
    </UserDevicesContext.Provider>
  );
};
