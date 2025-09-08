import { useState, useEffect } from 'react';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    setTimeout(() => {
      setOrders([]); // Dữ liệu thực tế sẽ lấy từ API
      setLoading(false);
    }, 500);
  }, []);

  return { orders, loading };
}
