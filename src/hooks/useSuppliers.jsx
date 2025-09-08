import { useState, useEffect } from 'react';

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSuppliers([
        {
          id: 'sup1',
          name: 'Công ty ABC',
          contact: '0123456789',
          address: '123 Đường A, Quận B',
          devicesSupplied: [
            { deviceId: 'dev1', supplyDate: '2025-08-01', quantity: 10 },
            { deviceId: 'dev2', supplyDate: '2025-08-05', quantity: 5 }
          ],
          orders: [
            { orderId: 'order1', deviceId: 'dev1', quantity: 10, status: 'Đã nhận', createdAt: '2025-08-01' },
            { orderId: 'order2', deviceId: 'dev2', quantity: 5, status: 'Đang giao', createdAt: '2025-08-05' }
          ],
          createdAt: '2025-07-01',
          updatedAt: '2025-08-10'
        },
        {
          id: 'sup2',
          name: 'Công ty XYZ',
          contact: '0987654321',
          address: '456 Đường X, Quận Y',
          devicesSupplied: [
            { deviceId: 'dev3', supplyDate: '2025-08-10', quantity: 7 }
          ],
          orders: [
            { orderId: 'order3', deviceId: 'dev3', quantity: 7, status: 'Đã nhận', createdAt: '2025-08-10' }
          ],
          createdAt: '2025-07-15',
          updatedAt: '2025-08-12'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Thêm nhà cung cấp
  const addSupplier = (newSupplier) => {
    setSuppliers(prev => [...prev, newSupplier]);
  };

  // Sửa nhà cung cấp
  const editSupplier = (id, updatedSupplier) => {
    setSuppliers(prev => prev.map(sup => sup.id === id ? { ...sup, ...updatedSupplier } : sup));
  };

  // Xóa nhà cung cấp
  const deleteSupplier = (id) => {
    setSuppliers(prev => prev.filter(sup => sup.id !== id));
  };

  return { suppliers, loading, addSupplier, editSupplier, deleteSupplier };
}
