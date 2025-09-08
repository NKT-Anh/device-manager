import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  Unsubscribe ,
  onSnapshot,
} from "firebase/firestore";


// Kiểu dữ liệu của DeviceHistory
export interface DeviceHistory {
  id?: string;
  devices?: { deviceName: string; type?: string; status?: string }[];
  name?: string;
  email?: string;
  reason?: string;
  startDate?: any;
  endDate?: any;
  status?: string;
  updatedAt?: any;
}

export const deviceHistoryCol = collection(db, "deviceHistory");

// Thêm lịch sử thiết bị
export const addDeviceHistory = async (data: DeviceHistory) => {
  try {
    await addDoc(deviceHistoryCol, {
      ...data,
      startDate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error: unknown) {
    console.error("Error adding device history:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

// Lấy lịch sử theo facilityId
export const getDeviceHistoryRealtime = (
  facilityId: string,
  callback: (data: DeviceHistory[]) => void,
  errorCallback?: (error: any) => void
): Unsubscribe | undefined => {
  if (!facilityId) {
    console.warn("Facility ID chưa có, không thể setup listener.");
    return;
  }

  try {
    // Query realtime filter theo facilityId và orderBy updatedAt giảm dần
    const q = query(
      deviceHistoryCol,
      where("facilityId", "==", facilityId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: DeviceHistory[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startDate: data.startDate?.toDate?.()?.toLocaleString() || null,
            endDate: data.endDate?.toDate?.()?.toLocaleString() || null,
            updatedAt: data.updatedAt?.toDate?.()?.toLocaleString() || null,
          };
        });
        callback(list);
      },
      (error) => {
        console.error("Error fetching realtime history:", error);
        if (errorCallback) errorCallback(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up realtime listener:", error);
    if (errorCallback) errorCallback(error);
  }
};