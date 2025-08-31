import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc,getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

type Role = "admin" | "manager" | "staff";
export const createUser = async (
  email: string,
  password: string,
  name: string,
  role: Role = "staff",
  facilityId: string | null = null,
  departmentId: string | null = null
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      name,
      email,
      role,
      facilityId,
      departmentId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, uid: user.uid };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      return { success: false, message: "Người dùng không tồn tại trong hệ thống" };
    }

    return { success: true, user: userDoc.data() };
  } catch (error: any) {
    
    let message = error.message;
    if (error.code === "auth/user-not-found") message = "Email không tồn tại";
    else if (error.code === "auth/wrong-password") message = "Mật khẩu không đúng";
    else if (error.code === "auth/invalid-credential") message = "Thống tin đăng nhập không hợp lệ";
    else if (error.code === "auth/invalid-email") message = "Email không hợp lệ";

    return { success: false, message };
  }
};