import { useState, useEffect, useMemo } from 'react';
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

export const useFacilities = (searchTerm = '', page = 1, itemsPerPage = 5) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tất cả facilities
  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'facilities'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const facilitiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFacilities(facilitiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Thêm facility mới
  const addFacility = async (facilityData) => {
    try {
      const docRef = await addDoc(collection(db, 'facilities'), {
        ...facilityData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newFacility = {
        id: docRef.id,
        ...facilityData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setFacilities(prev => [newFacility, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Cập nhật facility
  const updateFacility = async (id, facilityData) => {
    try {
      const facilityRef = doc(db, 'facilities', id);
      await updateDoc(facilityRef, {
        ...facilityData,
        updatedAt: serverTimestamp()
      });
      
      setFacilities(prev => 
        prev.map(facility => 
          facility.id === id 
            ? { ...facility, ...facilityData, updatedAt: new Date() }
            : facility
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Xóa facility
  const deleteFacility = async (id) => {
    try {
      await deleteDoc(doc(db, 'facilities', id));
      setFacilities(prev => prev.filter(facility => facility.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Lọc facilities dựa trên searchTerm
  const filteredFacilities = useMemo(() => {
    if (!searchTerm.trim()) return facilities;
    
    const searchLower = searchTerm.toLowerCase();
    return facilities.filter(facility => 
      facility.name?.toLowerCase().includes(searchLower) ||
      facility.address?.toLowerCase().includes(searchLower) ||
      facility.phone?.toLowerCase().includes(searchLower)
    );
  }, [facilities, searchTerm]);

  // Tính toán phân trang
  const totalItems = filteredFacilities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFacilities = filteredFacilities.slice(startIndex, endIndex);

  useEffect(() => {
    fetchFacilities();
  }, []);

  return {
    facilities: paginatedFacilities,
    allFacilities: facilities,
    filteredFacilities,
    loading,
    error,
    addFacility,
    updateFacility,
    deleteFacility,
    refetch: fetchFacilities,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};