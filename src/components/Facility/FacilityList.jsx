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
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useFacilities } from '../../hooks/useFacilities';
import { useStaff } from '../../hooks/useStaff';
import FacilityForm from './FacilityForm';
import Pagination from '../Common/Pagination';

const FacilityList = () => {
  // State cho tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { 
    facilities, 
    loading, 
    error, 
    addFacility, 
    updateFacility, 
    deleteFacility,
    pagination
  } = useFacilities(searchTerm, currentPage, itemsPerPage);
  
  const { staff } = useStaff();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, facility: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Xử lý tìm kiếm
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Xử lý phân trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi số mục per page
  };

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
    <Box sx={{ p: 3, pt: 11 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Quản lý Cơ sở
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          + THÊM CƠ SỞ
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên cơ sở, địa chỉ hoặc số điện thoại..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600 }}
        />
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
                      const manager = staff.find(s => s.id === facility.managerId);
                      return manager ? (
                        <Chip 
                          label={`${manager.name}`} 
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
                    {searchTerm ? 'Không tìm thấy cơ sở nào phù hợp' : 'Chưa có cơ sở nào'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Debug info - remove this later */}
      {pagination && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2">
            Debug: Total items: {pagination.totalItems}, Total pages: {pagination.totalPages}, 
            Current page: {pagination.currentPage}, Items per page: {pagination.itemsPerPage}
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

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