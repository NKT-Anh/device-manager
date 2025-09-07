import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, deleteOrder, updateOrder } from '../../services/manager/ordersApi';
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
  DialogContentText
} from '@mui/material';


const initialForm = {
  deviceId: '',
  deviceName: '',
  quantity: '',
  supplierId: '',
  status: 'Đã gửi',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleOpen = (item, idx) => {
    if (item) {
      setForm(item);
      setEditIndex(idx);
    } else {
      setForm({ ...initialForm, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
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

  const handleSave = async () => {
    if (editIndex !== null) {
      const updatedOrder = { ...form, updatedAt: new Date().toISOString() };
      await updateOrder(form.id, updatedOrder);
      setOrders(orders.map((o, i) => i === editIndex ? updatedOrder : o));
    } else {
      const newOrder = { ...form, status: 'Đã gửi', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      const created = await createOrder(newOrder);
      setOrders([...orders, created]);
    }
    handleClose();
  };

  const handleDelete = async () => {
    if (orderToDelete) {
      await deleteOrder(orderToDelete.id);
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      setOrderToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const openDeleteDialog = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (orderToCancel) {
      const updatedOrder = {
        ...orderToCancel,
        status: 'Chờ xác nhận hủy',
        cancelReason,
        updatedAt: new Date().toISOString()
      };
      await updateOrder(orderToCancel.id, updatedOrder);
      setOrders(orders.map(o => o.id === orderToCancel.id ? updatedOrder : o));
      setOrderToCancel(null);
      setCancelReason('');
    }
    setCancelDialogOpen(false);
  };

  const openCancelDialog = (order) => {
    setOrderToCancel(order);
    setCancelDialogOpen(true);
  };
  const openDetailDialog = (order) => {
    setOrderDetail(order);
    setDetailDialogOpen(true);
  };
  const closeDetailDialog = () => {
    setOrderDetail(null);
    setDetailDialogOpen(false);
  };

  return (
    <Box sx={{ pt: 11, p: 10 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Quản lý Đơn hàng
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Thêm đơn hàng
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Mã thiết bị</TableCell>
              <TableCell>Tên thiết bị</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.deviceId}</TableCell>
                <TableCell>{item.deviceName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.supplierId}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell>{new Date(item.updatedAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(item, idx)}>Sửa</Button>
                  <Button size="small" color="error" onClick={() => openDeleteDialog(item)}>Xóa</Button>
                  <Button size="small" onClick={() => openDetailDialog(item)}>Xem chi tiết</Button>
                  {item.status !== 'Chờ xác nhận hủy' && item.status !== 'Đã hủy' && (
                    <Button size="small" color="warning" onClick={() => openCancelDialog(item)}>
                      Hủy đơn hàng
                    </Button>
                  )}
      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xóa đơn hàng này không?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog nhập lý do hủy */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Nhập lý do hủy đơn hàng</DialogTitle>
        <DialogContent>
          <TextField
            label="Lý do hủy"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleCancelOrder} color="warning" variant="contained" disabled={!cancelReason.trim()}>
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem chi tiết đơn hàng */}
      <Dialog open={detailDialogOpen} onClose={closeDetailDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent>
          {orderDetail && (
            <Box>
              <Typography><b>Mã đơn hàng:</b> {orderDetail.id}</Typography>
              <Typography><b>Mã thiết bị:</b> {orderDetail.deviceId}</Typography>
              <Typography><b>Tên thiết bị:</b> {orderDetail.deviceName}</Typography>
              <Typography><b>Số lượng:</b> {orderDetail.quantity}</Typography>
              <Typography><b>Nhà cung cấp:</b> {orderDetail.supplierId}</Typography>
              <Typography><b>Trạng thái:</b> {orderDetail.status}</Typography>
              <Typography><b>Ngày tạo:</b> {new Date(orderDetail.createdAt).toLocaleString('vi-VN')}</Typography>
              <Typography><b>Ngày cập nhật:</b> {new Date(orderDetail.updatedAt).toLocaleString('vi-VN')}</Typography>
              {orderDetail.cancelReason && (
                <Typography color="error"><b>Lý do hủy:</b> {orderDetail.cancelReason}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Sửa đơn hàng' : 'Thêm đơn hàng'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Mã thiết bị"
            name="deviceId"
            value={form.deviceId}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Tên thiết bị"
            name="deviceName"
            value={form.deviceName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Số lượng"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Nhà cung cấp"
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            fullWidth
            required
          />
          {/* Trường trạng thái đã ẩn vì không cần thiết khi tạo đơn hàng */}
          <TextField
            margin="normal"
            label="Ngày tạo"
            name="createdAt"
            value={new Date(form.createdAt).toLocaleString('vi-VN')}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="normal"
            label="Ngày cập nhật"
            name="updatedAt"
            value={new Date(form.updatedAt).toLocaleString('vi-VN')}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Đặt hàng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;
