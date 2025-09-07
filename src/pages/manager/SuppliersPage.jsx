import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  DialogContentText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  fetchSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from '../../services/manager/suppliersApi';

const initialForm = {
  name: '',
  contact: '',
  address: '',
  devicesSupplied: [],
  createdAt: '',
  updatedAt: '',
};

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deviceForm, setDeviceForm] = useState({ deviceId: '', deviceName: '', supplyDate: '', quantity: '' });
  const [openDevicesDialog, setOpenDevicesDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchSuppliers();
      setSuppliers(data);
    };
    load();
  }, []);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setForm({ ...initialForm, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    setOpenDialog(true);
  };

  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);
    setForm({ ...supplier });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSupplier(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeviceChange = (e) => {
    setDeviceForm({ ...deviceForm, [e.target.name]: e.target.value });
  };
  const handleAddDevice = () => {
    if (deviceForm.deviceId && deviceForm.deviceName && deviceForm.supplyDate && deviceForm.quantity) {
      setForm({ ...form, devicesSupplied: [...form.devicesSupplied, deviceForm] });
      setDeviceForm({ deviceId: '', deviceName: '', supplyDate: '', quantity: '' });
    }
  };
  const handleDeleteDevice = (idx) => {
    setForm({ ...form, devicesSupplied: form.devicesSupplied.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    const data = {
      ...form,
      createdAt: editingSupplier ? form.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editingSupplier && editingSupplier.id) {
      await updateSupplier(editingSupplier.id, data);
    } else {
      await addSupplier(data);
    }
    const updated = await fetchSuppliers();
    setSuppliers(updated);
    handleCloseDialog();
  };

  const handleDelete = async (id) => {
    await deleteSupplier(id);
    const updated = await fetchSuppliers();
    setSuppliers(updated);
  };

  const handleShowDevices = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenDevicesDialog(true);
  };
  const handleCloseDevicesDialog = () => {
    setOpenDevicesDialog(false);
    setSelectedSupplier(null);
  };

  return (
    <Box sx={{ pt: 11 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Quản lý Nhà cung cấp</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ mb: 2 }}>
        Thêm nhà cung cấp
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên nhà cung cấp</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Thiết bị cung cấp</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map(supplier => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>
                  <Chip
                    label={(Array.isArray(supplier.devicesSupplied) ? supplier.devicesSupplied.length : 0) + ' thiết bị'}
                    color="primary"
                    clickable
                    onClick={() => handleShowDevices(supplier)}
                  />
                </TableCell>
                <TableCell>{supplier.createdAt ? new Date(supplier.createdAt).toLocaleString('vi-VN') : ''}</TableCell>
                <TableCell>{supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleString('vi-VN') : ''}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenEdit(supplier)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(supplier.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên nhà cung cấp"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Liên hệ"
            name="contact"
            fullWidth
            value={form.contact}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Địa chỉ"
            name="address"
            fullWidth
            value={form.address}
            onChange={handleChange}
          />
          <Box mt={2}>
            <Typography fontWeight="bold">Thiết bị cung cấp</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mã thiết bị</TableCell>
                  <TableCell>Tên thiết bị</TableCell>
                  <TableCell>Ngày cung cấp</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(form.devicesSupplied) && form.devicesSupplied.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{d.deviceId}</TableCell>
                    <TableCell>{d.deviceName}</TableCell>
                    <TableCell>{d.supplyDate}</TableCell>
                    <TableCell>{d.quantity}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteDevice(idx)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <TextField size="small" name="deviceId" value={deviceForm.deviceId} onChange={handleDeviceChange} placeholder="Mã thiết bị" />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" name="deviceName" value={deviceForm.deviceName} onChange={handleDeviceChange} placeholder="Tên thiết bị" />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" name="supplyDate" type="date" value={deviceForm.supplyDate} onChange={handleDeviceChange} InputLabelProps={{ shrink: true }} />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" name="quantity" value={deviceForm.quantity} onChange={handleDeviceChange} placeholder="Số lượng" type="number" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={handleAddDevice}>Thêm</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box mt={2}>
            <TextField
              label="Ngày tạo"
              type="date"
              value={editingSupplier ? editingSupplier.createdAt : new Date().toISOString().slice(0,10)}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Ngày cập nhật"
              type="date"
              value={editingSupplier ? editingSupplier.updatedAt : new Date().toISOString().slice(0,10)}
              fullWidth
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem chi tiết thiết bị cung cấp */}
      <Dialog open={openDevicesDialog} onClose={handleCloseDevicesDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Danh sách thiết bị cung cấp</DialogTitle>
        <DialogContent>
          {selectedSupplier && Array.isArray(selectedSupplier.devicesSupplied) && selectedSupplier.devicesSupplied.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Mã thiết bị</TableCell>
                  <TableCell>Tên thiết bị</TableCell>
                  <TableCell>Ngày cung cấp</TableCell>
                  <TableCell>Số lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSupplier.devicesSupplied.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{d.deviceId}</TableCell>
                    <TableCell>{d.deviceName}</TableCell>
                    <TableCell>{d.supplyDate}</TableCell>
                    <TableCell>{d.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <DialogContentText>Không có thiết bị cung cấp nào.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDevicesDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersPage;
