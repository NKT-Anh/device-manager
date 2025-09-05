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
  Query ,
} from "firebase/firestore";

export const userDevicesCol = collection(db, "userDevices");

export const createUserDevice = async (data: {
  userName: string;
  email: string;
  role: string;
  reason: string;
  facilityId: string;
  devices: { deviceId: string | null; deviceName: string }[];
}) => {
  try {
    const docRef = await addDoc(userDevicesCol, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};


export const getAllUserDevices = async (facilityId?: string) => {
  try {
    let q: Query = userDevicesCol; 

    if (facilityId) {
      q = query(userDevicesCol, where("facilityId", "==", facilityId), orderBy("createdAt", "desc"));
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

export const updateUserDevice = async (id: string, data: any) => {
  try {
    await updateDoc(doc(db, "userDevices", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const deleteUserDevice = async (id: string) => {
  try {
    await deleteDoc(doc(db, "userDevices", id));
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
