import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface UserUpdateData {
  name?: string;
  email?: string;
  facilityId?: string | null;

}


export const updateUserInfo = async (
  userId: string, 
  data: UserUpdateData
): Promise<{ success: boolean; error?: any }> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data as any);
    return { success: true };
  } catch (error) {
    console.error("Lỗi cập nhật user:", error);
    return { success: false, error };
  }
};
