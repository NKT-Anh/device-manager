import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

export const createOrder = async (order: any) => {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
  return { ...order, id: docRef.id };
};

export const getOrders = async () => {
  const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateOrder = async (id: any, data: any) => {
  await updateDoc(doc(db, ORDERS_COLLECTION, id), data);
};

export const deleteOrder = async (id: any) => {
  await deleteDoc(doc(db, ORDERS_COLLECTION, id));
};
