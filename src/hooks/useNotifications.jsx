import { useState, useEffect } from 'react';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        {
          _id: 'noti1',
          title: 'Thiết bị hết hàng',
          message: 'Thiết bị Laptop đã hết hàng trong kho.',
          recipientIds: ['manager1', 'staff1'],
          readStatus: false,
          createdAt: '2025-09-01'
        },
        {
          _id: 'noti2',
          title: 'Đơn hàng mới',
          message: 'Đã có đơn hàng mới từ Công ty XYZ.',
          recipientIds: ['manager1'],
          readStatus: true,
          createdAt: '2025-09-05'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return { notifications, loading };
}
