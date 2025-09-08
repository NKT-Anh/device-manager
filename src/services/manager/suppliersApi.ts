import { db } from '../../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

const SUPPLIERS_COLLECTION = 'suppliers';

export const fetchSuppliers = async () => {
  const snapshot = await getDocs(collection(db, SUPPLIERS_COLLECTION));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSupplier = async (data: any) => {
  const docRef = await addDoc(collection(db, SUPPLIERS_COLLECTION), data);
  return docRef.id;
};

export const updateSupplier = async (id: any, data: any) => {
  await updateDoc(doc(db, SUPPLIERS_COLLECTION, id), data);
};

export const deleteSupplier = async (id: any) => {
  await deleteDoc(doc(db, SUPPLIERS_COLLECTION, id));
};
