import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel } from "@mui/material";
import { Delete as DeleteIcon, People as PeopleIcon } from "@mui/icons-material";
import { listUsers, updateUserRole, deleteUserById, updateUserProfile } from "../../services/admin/adminApi";
import { useFacilities } from "../../hooks/useFacilities";

const roles = ["staff", "manager"];

const HomeAdmin = () => {
  const [users, setUsers] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, uid: null });
  const [selectedFacility, setSelectedFacility] = useState('');
  const { facilities } = useFacilities();

  const load = async () => {
    const data = await listUsers();
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (uid, role) => {
    await updateUserRole(uid, role);
    await load();
  };

  const handleFacilityChange = async (uid, facilityId) => {
    await updateUserProfile(uid, { facilityId: facilityId || null });
    await load();
  };

  const handleDelete = async () => {
    if (!confirm.uid) return;
    await deleteUserById(confirm.uid);
    setConfirm({ open: false, uid: null });
    await load();
  };

  const filteredUsers = useMemo(() => {
    if (!selectedFacility) return users;
    return users.filter(u => u.facilityId === selectedFacility);
  }, [users, selectedFacility]);

  const stats = useMemo(() => {
    const total = users.length;
    const managers = users.filter(u => u.role === 'manager').length;
    const staff = users.filter(u => u.role === 'staff').length;
    return { total, managers, staff };
  }, [users]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Quản lý tài khoản</Typography>

      {/* Facility Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo cơ sở</InputLabel>
          <Select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            label="Lọc theo cơ sở"
          >
            <MenuItem value="">
              <em>Tất cả cơ sở</em>
            </MenuItem>
            {facilities.map((facility) => (
              <MenuItem key={facility.id} value={facility.id}>
                {facility.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{stats.total}</Typography>
                  <Typography variant="body2" color="text.secondary">Tổng tài khoản</Typography>
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
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{stats.managers}</Typography>
                  <Typography variant="body2" color="text.secondary">Manager</Typography>
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
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{stats.staff}</Typography>
                  <Typography variant="body2" color="text.secondary">Staff</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Quyền</TableCell>
            <TableCell>Cơ sở</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Select size="small" value={u.role || "staff"} onChange={e => handleRoleChange(u.id, e.target.value)}>
                  {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
              </TableCell>
              <TableCell>
                <Select 
                  size="small" 
                  value={u.facilityId || ""} 
                  onChange={e => handleFacilityChange(u.id, e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">
                    <em>Chưa chọn cơ sở</em>
                  </MenuItem>
                  {facilities.map(facility => (
                    <MenuItem key={facility.id} value={facility.id}>
                      {facility.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="right">
                <IconButton color="error" onClick={() => setConfirm({ open: true, uid: u.id })}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, uid: null })}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc muốn xóa tài khoản này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, uid: null })}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeAdmin;
