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
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useStaff } from '../../hooks/useStaff';

const FacilityForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  facility = null, 
  loading = false 
}) => {
  const [error, setError] = useState('');
  const { staff } = useStaff();
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (open) {
      if (facility) {
        reset({
          name: facility.name,
          address: facility.address,
          phone: facility.phone,
          managerId: facility.managerId || ''
        });
      } else {
        reset({
          name: '',
          address: '',
          phone: '',
          managerId: ''
        });
      }
    }
  }, [facility, reset, open]);

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {facility ? 'Chỉnh sửa cơ sở' : 'Thêm cơ sở mới'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Tên cơ sở"
              fullWidth
              {...register('name', { 
                required: 'Tên cơ sở là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên cơ sở phải có ít nhất 2 ký tự'
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            
            <TextField
              label="Địa chỉ"
              fullWidth
              multiline
              rows={3}
              {...register('address', { 
                required: 'Địa chỉ là bắt buộc' 
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            
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
            
            <FormControl fullWidth>
              <InputLabel>Manager</InputLabel>
              <Controller
                name="managerId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Manager"
                    value={field.value || ''}
                    disabled={false}
                  >
                    <MenuItem value="">
                      <em>Chưa chọn manager</em>
                    </MenuItem>
                    {staff
                      .filter(s => s.position === 'Facility Management')
                      .map((staffMember) => (
                        <MenuItem key={staffMember.id} value={staffMember.id}>
                          {staffMember.name} ({staffMember.employeeId}) - {staffMember.department}
                        </MenuItem>
                      ))}
                    {staff.filter(s => s.position === 'Facility Management').length === 0 && (
                      <MenuItem disabled>
                        <em>Chưa có Manager nào. Vui lòng thêm Manager trong Quản lý Nhân viên.</em>
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormControl>
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
            {facility ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FacilityForm;