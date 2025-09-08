import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Stack
} from '@mui/material';
import GridOrig from '@mui/material/Grid';

import { createEquipment, updateEquipment } from '../../services/manager/inventoryApi';
import { STATUS_LABELS } from '../../utils/statusLabel'; // nếu bạn dùng nhãn tiếng Việt


const STATUS = ['available', 'assigned', 'maintenance'];
const Grid = GridOrig;
export default function EquipmentForm({ open, onClose, editing }) {
  // thông tin chung
  const [form, setForm] = useState({
    name: '',
    type: '',
    status: 'available',
    description: '',
    specs: {}
  });

  // các thông số tách riêng
  const [ram, setRam] = useState('');
  const [psu, setPsu] = useState('');
  const [cpu, setCpu] = useState('');
  const [vga, setVga] = useState('');
  const [main, setMain] = useState('');

  // khi mở form / sửa
  useEffect(() => {
    if (editing) {
      setForm(editing);
      const s = editing.specs || {};
      setRam(String(s.RAM || ''));
      setPsu(String(s.PSU || s.Nguồn || ''));
      setCpu(String(s.CPU || ''));
      setVga(String(s.VGA || ''));
      setMain(String(s.MAIN || s.Main || ''));
    } else {
        const init = { name: '', type: '', status: 'available', description: '', specs: {} };
        setForm(init);
      setRam(''); setPsu(''); setCpu(''); setVga(''); setMain('');
    }
  }, [editing]);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async () => {
    // gộp specs từ các ô nhập
    const cleanSpecs = {};
    if (ram)  cleanSpecs.RAM  = ram;
    if (psu)  cleanSpecs.PSU  = psu;     // đặt key chuẩn là PSU
    if (cpu)  cleanSpecs.CPU  = cpu;
    if (vga)  cleanSpecs.VGA  = vga;
    if (main) cleanSpecs.MAIN = main;

    const payload = { ...form, specs: cleanSpecs };

    if (editing?.id) await updateEquipment(editing.id, payload);
    else await createEquipment(payload);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Sửa thiết bị' : 'Thêm thiết bị'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Tên thiết bị" value={form.name}
            onChange={(e) => onChange('name', e.target.value)} fullWidth />

          <TextField label="Loại (VD: Laptop, Monitor…)" value={form.type}
            onChange={(e) => onChange('type', e.target.value)} fullWidth />

          <TextField select label="Trạng thái" value={form.status}
            onChange={(e) => onChange('status', e.target.value)}>
            {STATUS.map(s => <MenuItem key={s} value={s}>{STATUS_LABELS?.[s] ?? s}</MenuItem>)}
          </TextField>

          {/* Các thông số phần cứng */}
{/* Các thông số phần cứng */}
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <TextField label="RAM" placeholder="8GB, 16GB…" value={ram} onChange={(e) => setRam(e.target.value)} fullWidth />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField label="Nguồn (PSU)" placeholder="500W, 650W…" value={psu} onChange={(e) => setPsu(e.target.value)} fullWidth />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField label="CPU" placeholder="i5-12400F, Ryzen 5…" value={cpu} onChange={(e) => setCpu(e.target.value)} fullWidth />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField label="VGA (GPU)" placeholder="GTX 1650, RTX 3060…" value={vga} onChange={(e) => setVga(e.target.value)} fullWidth />
  </Grid>
  <Grid item xs={12}>
    <TextField label="MAIN (Mainboard)" placeholder="B660, B550…" value={main} onChange={(e) => setMain(e.target.value)} fullWidth />
  </Grid>
</Grid>



          <TextField label="Mô tả" value={form.description || ''}
            onChange={(e) => onChange('description', e.target.value)} fullWidth multiline minRows={2} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>HỦY</Button>
        <Button variant="contained" onClick={onSubmit}>LƯU</Button>
      </DialogActions>
    </Dialog>
  );
}
