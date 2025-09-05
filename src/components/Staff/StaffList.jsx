import React, { useState } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useStaff } from '../../hooks/useStaff';
import StaffForm from './StaffForm';

const StaffList = () => {
  const { 
    staff, 
    loading, 
    error, 
    addStaff, 
    updateStaff, 
    deleteStaff 
  } = useStaff();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, staff: null });
  const [actionLoading, setActionLoading] = useState(false);

  const handleOpenForm = (staffMember = null) => {
    setSelectedStaff(staffMember);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedStaff(null);
  };

  const handleSubmitForm = async (data) => {
    setActionLoading(true);
    try {
      let result;
      if (selectedStaff) {
        result = await updateStaff(selectedStaff.id, data);
      } else {
        result = await addStaff(data);
      }
      return result;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (staffMember) => {
    setDeleteDialog({ open: true, staff: staffMember });
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await deleteStaff(deleteDialog.staff.id);
      setDeleteDialog({ open: false, staff: null });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('vi-VN');
  };

  const formatSalary = (salary) => {
    if (!salary) return '--';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(salary);
  };

  const getPositionColor = (position) => {
    const colors = {
      'Facility Management': 'primary',
      'Technical Staff': 'secondary'
    };
    return colors[position] || 'default';
  };

  if (loading && staff.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý Nhân viên
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Thêm nhân viên
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {staff.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng nhân viên
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <WorkIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {staff.filter(s => s.position === 'Facility Management').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quản lý cơ sở
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <WorkIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {staff.filter(s => s.position === 'Technical Staff').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nhân viên kỹ thuật
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Mã NV</TableCell>
              <TableCell>Chức vụ</TableCell>
              <TableCell>Phòng ban</TableCell>
              <TableCell>Liên hệ</TableCell>
              <TableCell>Lương</TableCell>
              <TableCell>Ngày tuyển</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((staffMember) => (
              <TableRow key={staffMember.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {staffMember.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {staffMember.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {staffMember.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {staffMember.employeeId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={staffMember.position} 
                    size="small" 
                    color={getPositionColor(staffMember.position)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {staffMember.department}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {staffMember.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {staffMember.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {formatSalary(staffMember.salary)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {formatDate(staffMember.hireDate)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenForm(staffMember)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(staffMember)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="text.secondary">
                    Chưa có nhân viên nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      {formOpen && (
        <StaffForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          staff={selectedStaff}
          loading={actionLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, staff: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa nhân viên "{deleteDialog.staff?.name}"?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, staff: null })}
            disabled={actionLoading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : null}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffList;
