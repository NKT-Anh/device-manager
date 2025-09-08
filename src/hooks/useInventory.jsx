import { useEffect, useMemo, useState } from 'react';
import { subscribeEquipment } from '../services/manager/inventoryApi';

export default function useInventory(status) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});

  // Realtime theo Firestore
  useEffect(() => {
    const unsub = subscribeEquipment((r) => {
      setRows(r);
      setLoading(false);
    }, status);
    return () => unsub();
  }, [status]);

  // Tính summary mỗi khi rows thay đổi (kể cả chỉ đổi status)
  useEffect(() => {
    const byType = {};
    for (const e of rows) {
      const t = e.type || 'Khác';
      if (!byType[t]) byType[t] = { total: 0, available: 0, assigned: 0, maintenance: 0 };
      byType[t].total++;
      byType[t][e.status] = (byType[t][e.status] || 0) + 1;
    }
    setSummary(byType);
  }, [rows]);

  const lowStockTypes = useMemo(() => {
    return Object.entries(summary)
      .filter(([, v]) => (v.available || 0) < 1)
      .map(([k]) => k);
  }, [summary]);

  return { rows, loading, summary, lowStockTypes };
}
