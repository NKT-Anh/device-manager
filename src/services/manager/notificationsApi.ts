import { db } from '../../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const fetchNotifications = async () => {
  const snapshot = await getDocs(collection(db, NOTIFICATIONS_COLLECTION));
  return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
};

export const addNotification = async (data: any) => {
  const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), data);
  return docRef.id;
};

export const updateNotification = async (_id: any, data: any) => {
  await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, _id), data);
};

export const deleteNotification = async (_id: any) => {
  await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, _id));
};

export const fetchNotificationsByRecipient = async (userId: any) => {
  const q = query(collection(db, NOTIFICATIONS_COLLECTION), where('recipientIds', 'array-contains', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
};
