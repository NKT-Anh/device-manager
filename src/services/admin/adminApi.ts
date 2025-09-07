import { collection, doc, getDocs, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export type Role = "manager" | "staff";

export const listUsers = async () => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const listUsersByRole = async (role: Role) => {
  const all = await listUsers();
  return all.filter((u: any) => u.role === role);
};

export const getUserById = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUserRole = async (uid: string, role: Role) => {
  await updateDoc(doc(db, "users", uid), { role });
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<{ name: string; email: string; facilityId: string | null; departmentId: string | null }>
) => {
  await updateDoc(doc(db, "users", uid), updates as any);
};

export const deleteUserById = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};