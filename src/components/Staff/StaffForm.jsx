import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
  Grid
} from '@mui/material';
import { useForm } from 'react-hook-form';

const StaffForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  staff = null, 
  loading = false 
}) => {
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const positions = [
    'Facility Management',
    'Technical Staff'
  ];

  const departments = [
    'Phòng ban Vận hành',
    'Phòng ban Hành chính',
    'Phòng ban Tài chính',
    'Phòng ban Nhân sự',
    'Phòng ban Bảo trì',
    'Phòng ban An ninh'
  ];

  useEffect(() => {
    if (open) {
      if (staff) {
        reset({
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          position: staff.position,
          department: staff.department,
          employeeId: staff.employeeId,
          address: staff.address,
          salary: staff.salary || '',
          hireDate: staff.hireDate || ''
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          employeeId: '',
          address: '',
          salary: '',
          hireDate: ''
        });
      }
    }
  }, [staff, reset, open]);

  const handleFormSubmit = async (data) => {
    try {
      setError('');
      const result = await onSubmit(data);
      if (result.success) {
        reset();
        onClose();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {staff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tên nhân viên"
                  fullWidth
                  {...register('name', { 
                    required: 'Tên nhân viên là bắt buộc',
                    minLength: {
                      value: 2,
                      message: 'Tên nhân viên phải có ít nhất 2 ký tự'
                    }
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mã nhân viên"
                  fullWidth
                  {...register('employeeId', { 
                    required: 'Mã nhân viên là bắt buộc' 
                  })}
                  error={!!errors.employeeId}
                  helperText={errors.employeeId?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  {...register('phone', {
                    required: 'Số điện thoại là bắt buộc',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Số điện thoại không hợp lệ'
                    }
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Chức vụ"
                  fullWidth
                  select
                  {...register('position', { 
                    required: 'Chức vụ là bắt buộc' 
                  })}
                  error={!!errors.position}
                  helperText={errors.position?.message}
                >
                  {positions.map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Phòng ban"
                  fullWidth
                  select
                  {...register('department', { 
                    required: 'Phòng ban là bắt buộc' 
                  })}
                  error={!!errors.department}
                  helperText={errors.department?.message}
                >
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>
                      {department}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lương"
                  fullWidth
                  type="number"
                  {...register('salary', {
                    min: {
                      value: 0,
                      message: 'Lương phải lớn hơn 0'
                    }
                  })}
                  error={!!errors.salary}
                  helperText={errors.salary?.message}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ngày tuyển dụng"
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...register('hireDate')}
                  error={!!errors.hireDate}
                  helperText={errors.hireDate?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ"
                  fullWidth
                  multiline
                  rows={3}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {staff ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StaffForm;
