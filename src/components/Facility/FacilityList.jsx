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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useFacilities } from '../../hooks/useFacilities';
import { useStaff } from '../../hooks/useStaff';
import FacilityForm from './FacilityForm';

const FacilityList = () => {
  const { 
    facilities, 
    loading, 
    error, 
    addFacility, 
    updateFacility, 
    deleteFacility 
  } = useFacilities();
  
  const { getStaffById } = useStaff();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, facility: null });
  const [actionLoading, setActionLoading] = useState(false);

  const handleOpenForm = (facility = null) => {
    setSelectedFacility(facility);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedFacility(null);
  };

  const handleSubmitForm = async (data) => {
    setActionLoading(true);
    try {
      let result;
      if (selectedFacility) {
        result = await updateFacility(selectedFacility.id, data);
      } else {
        result = await addFacility(data);
      }
      return result;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (facility) => {
    setDeleteDialog({ open: true, facility });
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await deleteFacility(deleteDialog.facility.id);
      setDeleteDialog({ open: false, facility: null });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading && facilities.length === 0) {
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
          Quản lý Cơ sở
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Thêm cơ sở
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên cơ sở</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Manager ID</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {facility.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {facility.address}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {facility.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {facility.managerId ? (
                    (() => {
                      const manager = getStaffById(facility.managerId);
                      return manager ? (
                        <Chip 
                          label={`${manager.name} (${manager.employeeId})`} 
                          size="small" 
                          color="primary"
                        />
                      ) : (
                        <Chip 
                          label={facility.managerId} 
                          size="small" 
                          color="primary"
                        />
                      );
                    })()
                  ) : (
                    <Chip 
                      label="Chưa có" 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {formatDate(facility.createdAt)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenForm(facility)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(facility)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {facilities.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="text.secondary">
                    Chưa có cơ sở nào
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      {formOpen && (
        <FacilityForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          facility={selectedFacility}
          loading={actionLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, facility: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa cơ sở "{deleteDialog.facility?.name}"?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, facility: null })}
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

export default FacilityList;