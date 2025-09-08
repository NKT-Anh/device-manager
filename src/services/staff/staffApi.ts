import { db } from "../../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  query,
  orderBy ,
  onSnapshot,
} from "firebase/firestore";

const userDevicesCol = collection(db, "userDevices");

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

export const onUserDevicesRealtime = (
  callback: (data: { id: string; [key: string]: any }[]) => void,
  errorCallback?: (error: any) => void
) => {
  try {
    const q = query(userDevicesCol, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(list);
      },
      (error) => {
        if (errorCallback) errorCallback(error);
      }
    );
    return unsubscribe;
  } catch (error: any) {
    if (errorCallback) errorCallback(error);
    return () => {};
  }
};

export const getAllUserDevices = async () => {
  try {
    const snapshot = await getDocs(userDevicesCol);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    return { success: true, data: { id: snap.id, ...snap.data() } };
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
