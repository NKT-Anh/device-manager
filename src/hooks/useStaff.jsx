import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tất cả staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'staff'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const staffData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStaff(staffData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thêm staff mới
  const addStaff = async (staffData) => {
    try {
      const docRef = await addDoc(collection(db, 'staff'), {
        ...staffData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newStaff = {
        id: docRef.id,
        ...staffData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setStaff(prev => [newStaff, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Cập nhật staff
  const updateStaff = async (id, staffData) => {
    try {
      const staffRef = doc(db, 'staff', id);
      await updateDoc(staffRef, {
        ...staffData,
        updatedAt: serverTimestamp()
      });
      
      setStaff(prev => 
        prev.map(staffMember => 
          staffMember.id === id 
            ? { ...staffMember, ...staffData, updatedAt: new Date() }
            : staffMember
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Xóa staff
  const deleteStaff = async (id) => {
    try {
      await deleteDoc(doc(db, 'staff', id));
      setStaff(prev => prev.filter(staffMember => staffMember.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Lấy staff theo ID
  const getStaffById = (id) => {
    return staff.find(staffMember => staffMember.id === id);
  };

  // Lấy danh sách staff cho dropdown
  const getStaffOptions = () => {
    return staff.map(staffMember => ({
      value: staffMember.id,
      label: `${staffMember.name} (${staffMember.position})`
    }));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaffById,
    getStaffOptions,
    refetch: fetchStaff
  };
};
