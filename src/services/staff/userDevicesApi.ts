import { db } from "../../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  orderBy,
  Query,
} from "firebase/firestore";

// Collection refs
export const userDevicesCol = collection(db, "userDevices");
export const deviceHistoryCol = collection(db, "deviceHistory");

// Thêm mới user + gán thiết bị
export const createUserDevice = async (data: {
  name: string;
  email: string;
  role: string;
  reason: string;
  facilityId: string;
  devices: { deviceId?: string | null; deviceName: string }[];
}) => {
  try {
    const devicesWithInfo = [];

    for (const d of data.devices) {
      if (d.deviceId) {
        // Nếu có deviceId thì truy vấn từ equipmentFacilities
        const snap = await getDoc(doc(db, "equipmentFacilities", d.deviceId));
        if (snap.exists()) {
          const devData = snap.data();
          devicesWithInfo.push({
            deviceId: d.deviceId,
            deviceName: devData.name || d.deviceName, // ưu tiên lấy từ bảng thiết bị
          });
        } else {
          // Không tìm thấy trong equipmentFacilities => fallback
          devicesWithInfo.push({
            deviceId: null,
            deviceName: d.deviceName,
          });
        }
      } else {
        // Trường hợp chỉ nhập tên, không có id
        devicesWithInfo.push({
          deviceId: null,
          deviceName: d.deviceName,
        });
      }
    }

    const docRef = await addDoc(userDevicesCol, {
      ...data,
      devices: devicesWithInfo,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      startDate: serverTimestamp(),
      endDate: null,
      status: "active",
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error creating userDevice:", error);
    return { success: false, message: error.message };
  }
};

// Lấy tất cả userDevices
export const getAllUserDevices = async (facilityId?: string) => {
  try {
    let q: Query = userDevicesCol;

    if (facilityId) {
      q = query(
        userDevicesCol,
        where("facilityId", "==", facilityId),
        orderBy("createdAt", "desc")
      );
    }

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        devices: data.devices || [],
      };
    });

    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Lấy theo ID
export const getUserDeviceById = async (id: string) => {
  try {
    const snap = await getDoc(doc(db, "userDevices", id));
    if (!snap.exists()) {
      return { success: false, message: "Không tìm thấy" };
    }
    const data = snap.data();
    return {
      success: true,
      data: {
        id: snap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
        devices: data.devices || [],
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Cập nhật userDevice (vd: trả thiết bị)
export const updateUserDevice = async (
  id: string,
  data: Partial<{
    devices: any[];
    reason: string;
    endDate: Date;
    status: string;
  }>
) => {
  try {
    await updateDoc(doc(db, "userDevices", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    // Nếu có endDate => ghi log trả thiết bị
    if (data.endDate) {
      await addDoc(deviceHistoryCol, {
        userDeviceId: id,
        action: "returned",
        endDate: data.endDate,
        updatedAt: serverTimestamp(),
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Xoá userDevice
export const deleteUserDevice = async (id: string) => {
  try {
    await deleteDoc(doc(db, "userDevices", id));
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
