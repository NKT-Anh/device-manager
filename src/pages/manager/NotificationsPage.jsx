import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  fetchNotifications,
  addNotification,
  updateNotification,
  deleteNotification
} from '../../services/manager/notificationsApi';

const initialForm = {
  _id: '',
  message: '',
  recipientIds: '',
  type: 'suco',
  status: 'sent',
  createdAt: new Date().toISOString(),
};

const typeOptions = [
  { value: 'suco', label: 'Sự cố thiết bị' },
  { value: 'hethang', label: 'Thiết bị hết hàng' },
  { value: 'phanhoi', label: 'Phản hồi' }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editIndex, setEditIndex] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    load();
  }, []);

  const handleOpen = (item, idx) => {
    if (item) {
      setForm({ ...item, recipientIds: Array.isArray(item.recipientIds) ? item.recipientIds.join(',') : item.recipientIds });
      setEditIndex(idx);
    } else {
      setForm({ ...initialForm, createdAt: new Date().toISOString() });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const role = "manager"; // Nếu sau này có context, lấy từ context
  const handleSave = async () => {
    const status = role === "manager" ? "sent" : "received";
    const data = {
      message: form.message,
      recipientIds: form.recipientIds.split(',').map(id => id.trim()),
      type: form.type,
      status,
      createdAt: form.createdAt,
    };
    if (editIndex !== null && notifications[editIndex]) {
      await updateNotification(notifications[editIndex]._id, data);
    } else {
      await addNotification(data);
    }
    const updated = await fetchNotifications();
    setNotifications(updated);
    handleClose();
  };

  const handleDelete = async (idx) => {
    await deleteNotification(notifications[idx]._id);
    const updated = await fetchNotifications();
    setNotifications(updated);
  };

  const handleShowDetail = (item) => {
    setSelectedNotification(item);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedNotification(null);
  };
  const handleReceived = async () => {
    if (selectedNotification) {
      await updateNotification(selectedNotification._id, { ...selectedNotification, status: 'received' });
      const updated = await fetchNotifications();
      setNotifications(updated);
      handleCloseDetail();
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const typeMatch = filterType === 'all' || n.type === filterType;
    const statusMatch = filterStatus === 'all' || n.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <Box sx={{ pt: 50, p: 10 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quản lý Thông báo
      </Typography>
      <FormControl sx={{ minWidth: 200, mb: 2, mr: 2 }}>
        <InputLabel>Loại thông báo</InputLabel>
        <Select
          value={filterType}
          label="Loại thông báo"
          onChange={e => setFilterType(e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {typeOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 160, mb: 2 }}>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          value={filterStatus}
          label="Trạng thái"
          onChange={e => setFilterStatus(e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="sent">Đã gửi</MenuItem>
          <MenuItem value="received">Đã nhận</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Gửi thông báo
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loại</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Người nhận</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNotifications.map((item, idx) => (
              <TableRow key={item._id}>
                <TableCell>{typeOptions.find(opt => opt.value === item.type)?.label || item.type}</TableCell>
                <TableCell>{item.message}</TableCell>
                <TableCell>{Array.isArray(item.recipientIds) ? item.recipientIds.join(', ') : item.recipientIds}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell>{item.status === 'received' ? 'Đã nhận' : 'Đã gửi'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(item, idx)}>Sửa</Button>
                  <Button size="small" color="info" onClick={() => handleShowDetail(item)}>Chi tiết</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(idx)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Sửa thông báo' : 'Gửi thông báo'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Loại thông báo</InputLabel>
            <Select
              name="type"
              value={form.type}
              label="Loại thông báo"
              onChange={handleChange}
            >
              {typeOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Nội dung"
            name="message"
            value={form.message}
            onChange={handleChange}
            fullWidth
            multiline
            required
          />
          <TextField
            margin="normal"
            label="ID người nhận (phân cách bằng dấu phẩy)"
            name="recipientIds"
            value={form.recipientIds}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Ngày tạo"
            name="createdAt"
            value={new Date(form.createdAt).toLocaleString('vi-VN')}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Gửi thông báo
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết thông báo</DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">Loại: {typeOptions.find(opt => opt.value === selectedNotification.type)?.label || selectedNotification.type}</Typography>
              <Typography variant="body1">Nội dung: {selectedNotification.message}</Typography>
              <Typography variant="body2">Người nhận: {Array.isArray(selectedNotification.recipientIds) ? selectedNotification.recipientIds.join(', ') : selectedNotification.recipientIds}</Typography>
              <Typography variant="body2">Ngày tạo: {new Date(selectedNotification.createdAt).toLocaleString('vi-VN')}</Typography>
              <Typography variant="body2" color={selectedNotification.status === 'received' ? 'success.main' : 'warning.main'}>
                Trạng thái: {selectedNotification.status === 'received' ? 'Đã nhận' : 'Đã gửi'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
          {selectedNotification?.status === 'received' && selectedNotification?.status !== 'confirmed' && (
            <Button onClick={handleReceived} variant="contained" color="primary">Đã tiếp nhận</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;
