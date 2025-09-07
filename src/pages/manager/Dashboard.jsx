import React, { useMemo } from 'react';
import { Grid, Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/Dashboard/StatCard';
import { useFacilities } from '../../hooks/useFacilities';

const Dashboard = () => {
  const { facilities, loading } = useFacilities();

  // Tính toán thống kê từ dữ liệu thực
  const stats = useMemo(() => {
    const totalFacilities = facilities.length;
    const facilitiesWithManager = facilities.filter(f => f.managerId).length;
    const facilitiesWithoutManager = totalFacilities - facilitiesWithManager;
    
    // Tính tỷ lệ có manager
    const managerCoverage = totalFacilities > 0 ? Math.round((facilitiesWithManager / totalFacilities) * 100) : 0;
    
    // Tính số cơ sở được tạo trong tháng này
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthFacilities = facilities.filter(f => {
      const createdAt = f.createdAt?.toDate ? f.createdAt.toDate() : new Date(f.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length;

    return {
      totalFacilities,
      facilitiesWithManager,
      facilitiesWithoutManager,
      managerCoverage,
      thisMonthFacilities
    };
  }, [facilities]);

  // Dữ liệu cho biểu đồ phân bố theo tháng
  const monthlyData = useMemo(() => {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const facilitiesInMonth = facilities.filter(f => {
        const createdAt = f.createdAt?.toDate ? f.createdAt.toDate() : new Date(f.createdAt);
        return createdAt.getMonth() === index && createdAt.getFullYear() === currentYear;
      }).length;
      
      return {
        name: month,
        facilities: facilitiesInMonth,
        cumulative: facilities.slice(0, index + 1).length
      };
    });
  }, [facilities]);

  // Dữ liệu cho biểu đồ tròn
  const pieData = useMemo(() => [
    { name: 'Có Manager', value: stats.facilitiesWithManager, color: '#2e7d32' },
    { name: 'Chưa có Manager', value: stats.facilitiesWithoutManager, color: '#ed6c02' }
  ], [stats]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
        Dashboard Quản lý Cơ sở
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <a href="#suppliers-section" style={{ textDecoration: 'none' }}>
          <Box sx={{ px: 2, py: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2, cursor: 'pointer', fontWeight: 'bold' }}>
            Nhà cung cấp
          </Box>
        </a>
        <a href="#orders-section" style={{ textDecoration: 'none' }}>
          <Box sx={{ px: 2, py: 1, bgcolor: 'success.main', color: 'white', borderRadius: 2, cursor: 'pointer', fontWeight: 'bold' }}>
            Đơn hàng
          </Box>
        </a>
        <a href="#notifications-section" style={{ textDecoration: 'none' }}>
          <Box sx={{ px: 2, py: 1, bgcolor: 'warning.main', color: 'white', borderRadius: 2, cursor: 'pointer', fontWeight: 'bold' }}>
            Thông báo
          </Box>
        </a>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng cơ sở"
            value={stats.totalFacilities}
            icon={<BusinessIcon sx={{ fontSize: 30 }} />}
            trend="up"
            trendValue={stats.thisMonthFacilities}
            color="primary"
            subtitle={`${stats.thisMonthFacilities} cơ sở mới trong tháng`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Có Manager"
            value={stats.facilitiesWithManager}
            icon={<PeopleIcon sx={{ fontSize: 30 }} />}
            trend="up"
            trendValue={stats.managerCoverage}
            color="success"
            subtitle={`${stats.managerCoverage}% tổng cơ sở`}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Chưa có Manager"
            value={stats.facilitiesWithoutManager}
            icon={<AssessmentIcon sx={{ fontSize: 30 }} />}
            trend={stats.facilitiesWithoutManager > 0 ? "down" : "up"}
            trendValue={stats.facilitiesWithoutManager}
            color="warning"
            subtitle="Cần bổ sung"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tỷ lệ hoàn thiện"
            value={`${stats.managerCoverage}%`}
            icon={<TrendingUpIcon sx={{ fontSize: 30 }} />}
            trend="up"
            trendValue={stats.managerCoverage}
            color="info"
            subtitle="Manager coverage"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Cơ sở được tạo theo tháng ({new Date().getFullYear()})
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="facilities" fill="#1976d2" name="Cơ sở mới" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Phân bố Manager
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {pieData.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: item.color, 
                        borderRadius: '50%',
                        mr: 1 
                      }} 
                    />
                    <Typography variant="body2">
                      {item.name}: {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities & Top Facilities */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Cơ sở gần đây
              </Typography>
              <Box sx={{ mt: 2 }}>
                {facilities.slice(0, 5).map((facility, index) => (
                  <Box 
                    key={facility.id}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < 4 ? '1px solid' : 'none',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          backgroundColor: '#1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {facility.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {facility.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {facility.address}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {facility.createdAt?.toDate ? 
                        facility.createdAt.toDate().toLocaleDateString('vi-VN') : 
                        '--'
                      }
                    </Typography>
                  </Box>
                ))}
                {facilities.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Chưa có cơ sở nào
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Cơ sở cần bổ sung Manager
              </Typography>
              <Box sx={{ mt: 2 }}>
                {facilities.filter(f => !f.managerId).slice(0, 5).map((facility, index) => (
                  <Box 
                    key={facility.id}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < 4 ? '1px solid' : 'none',
                      borderColor: 'grey.200'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          backgroundColor: '#ed6c02',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {facility.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {facility.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {facility.phone}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {facility.address.length > 20 ? 
                          `${facility.address.substring(0, 20)}...` : 
                          facility.address
                        }
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {facilities.filter(f => !f.managerId).length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Tất cả cơ sở đều đã có Manager
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Supplier & Orders Section */}
      <Grid container spacing={3} sx={{ mt: 4 }} id="suppliers-section">
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quản lý Nhà cung cấp
              </Typography>
              {/* Danh sách nhà cung cấp mẫu */}
              <Box sx={{ mt: 2 }}>
                {[{
                  id: 'sup1',
                  name: 'Công ty ABC',
                  contact: '0123456789',
                  address: '123 Đường A, Quận B',
                  devicesSupplied: 5
                }, {
                  id: 'sup2',
                  name: 'Công ty XYZ',
                  contact: '0987654321',
                  address: '456 Đường X, Quận Y',
                  devicesSupplied: 3
                }].map(supplier => (
                  <Box key={supplier.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                    <Typography fontWeight="bold">{supplier.name}</Typography>
                    <Typography variant="body2">Liên hệ: {supplier.contact}</Typography>
                    <Typography variant="body2">Địa chỉ: {supplier.address}</Typography>
                    <Typography variant="body2">Thiết bị đã cung cấp: {supplier.devicesSupplied}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} id="orders-section">
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Theo dõi Đơn hàng
              </Typography>
              {/* Đơn hàng mẫu */}
              <Box sx={{ mt: 2 }}>
                {[{
                  orderId: 'order1',
                  supplier: 'Công ty ABC',
                  device: 'Laptop',
                  quantity: 10,
                  status: 'Đã nhận',
                  createdAt: '2025-08-01'
                }, {
                  orderId: 'order2',
                  supplier: 'Công ty XYZ',
                  device: 'Monitor',
                  quantity: 5,
                  status: 'Đang giao',
                  createdAt: '2025-08-15'
                }].map(order => (
                  <Box key={order.orderId} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                    <Typography fontWeight="bold">{order.device} x {order.quantity}</Typography>
                    <Typography variant="body2">Nhà cung cấp: {order.supplier}</Typography>
                    <Typography variant="body2">Trạng thái: {order.status}</Typography>
                    <Typography variant="body2">Ngày tạo: {order.createdAt}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notifications Section */}
      <Grid container spacing={3} sx={{ mt: 4 }} id="notifications-section">
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Thông báo hệ thống
              </Typography>
              {/* Thông báo mẫu */}
              <Box sx={{ mt: 2 }}>
                {[{
                  id: 'noti1',
                  title: 'Thiết bị hết hàng',
                  message: 'Thiết bị Laptop đã hết hàng trong kho.',
                  createdAt: '2025-09-01'
                }, {
                  id: 'noti2',
                  title: 'Đơn hàng mới',
                  message: 'Đã có đơn hàng mới từ Công ty XYZ.',
                  createdAt: '2025-09-05'
                }].map(noti => (
                  <Box key={noti.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
                    <Typography fontWeight="bold">{noti.title}</Typography>
                    <Typography variant="body2">{noti.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{noti.createdAt}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;