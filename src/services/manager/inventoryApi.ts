import {
    collection, addDoc, updateDoc, deleteDoc, doc,
    serverTimestamp, onSnapshot, query, where, orderBy, getDocs
  } from 'firebase/firestore';
  import { db } from '../../firebase/firebaseConfig';
  
  export type EquipmentStatus = 'available' | 'assigned' | 'maintenance';
  
  export interface Equipment {
    id?: string;
    name: string;
    type: string;
    image?: string;
    status: EquipmentStatus;
    specs?: Record<string, any>;
    description?: string;
    currentFacilityId?: string | null;
    currentUser?: string | null;
    history?: Array<{ user?: string; facilityId?: string; action: string; timestamp: number }>;
    createdAt?: any;
    updatedAt?: any;
  }
  
  const EQUIP_COL = collection(db, 'equipment');
  
  // Realtime subscribe (có thể lọc theo status)
  export const subscribeEquipment = (
    cb: (rows: (Equipment & { id: string })[]) => void,
    status?: EquipmentStatus
  ) => {
    const q = status
      ? query(EQUIP_COL, where('status', '==', status), orderBy('name'))
      : query(EQUIP_COL, orderBy('name'));
    return onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Equipment) }));
      cb(rows);
    });
  };
  
  export const createEquipment = async (payload: Equipment) => {
    const docRef = await addDoc(EQUIP_COL, {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  };
  
  export const updateEquipment = async (id: string, partial: Partial<Equipment>) => {
    await updateDoc(doc(EQUIP_COL, id), { ...partial, updatedAt: serverTimestamp() });
  };
  
  export const removeEquipment = async (id: string) => {
    await deleteDoc(doc(EQUIP_COL, id));
  };
  
  // Tóm tắt tồn kho theo type + status
  export const getStockSummary = async () => {
    const snap = await getDocs(EQUIP_COL);
    const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Equipment) }));
    const byType: Record<string, { total: number; available: number; assigned: number; maintenance: number }> = {};
    for (const e of all) {
      const t = e.type || 'Khác';
      if (!byType[t]) byType[t] = { total: 0, available: 0, assigned: 0, maintenance: 0 };
      byType[t].total++;
      // @ts-ignore: index theo status
      byType[t][e.status]++;
    }
    return byType;
  };
  