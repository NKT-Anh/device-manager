import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/auth/firebaseApi';
import { useSidebar } from '../../context/SidebarContext';

const Navigation = () => {
  const { desktopOpen, setDesktopOpen, mobileOpen, setMobileOpen } = useSidebar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [role, setRole] = useState('staff');

  useEffect(() => {
    try {
      const cached = localStorage.getItem('currentUser');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.role) setRole(parsed.role);
      }
    } catch {}
  }, []);

  const managerMenuItems = [
    { id: 'dashboard', label: 'Thống kê', icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'facilities', label: 'Quản lý Cơ sở', icon: <BusinessIcon />, path: '/facilities' },
    { id: 'staff', label: 'Quản lý Nhân viên', icon: <PeopleIcon />, path: '/staff' },
    { id: 'suppliers', label: 'Nhà cung cấp', icon: <BusinessIcon />, path: '/suppliers' },
    { id: 'orders', label: 'Đơn hàng', icon: <LocalShippingIcon />, path: '/orders' },
    { id: 'notifications', label: 'Thông báo', icon: <NotificationsIcon />, path: '/notifications' }
  ];

  const staffMenuItems = [
    { id: 'home', label: 'Trang nhân viên', icon: <HomeIcon />, path: '/staff-home' }
  ];

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };
  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <HomeIcon color="primary" sx={{ fontSize: 24 }} />
          <Typography variant="h6" fontWeight="bold" color="primary" noWrap>
            Quản lý thiết bị
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          Hệ thống quản lý CNTT
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <List>
          {(role === 'manager' ? managerMenuItems : staffMenuItems).map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={isMobile ? handleDrawerToggle : undefined}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          
          {/* Admin Section - moved here */}
          {role === 'manager' && (
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate('/admin-home');
                  if (isMobile) handleDrawerToggle();
                }}
                selected={location.pathname === '/admin-home'}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Quản lý tài khoản" 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === '/admin-home' ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={async () => { 
              try {
                await logoutUser(); 
                navigate('/'); 
              } catch (error) {
                console.error('Logout error:', error);
              }
            }} 
            sx={{ 
              borderRadius: 2,
              mx: 1,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Đăng xuất" 
              primaryTypographyProps={{ 
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Left side - Toggle button and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" noWrap component="div" fontWeight="bold">
                Quản lý thiết bị CNTT
              </Typography>
            </Box>
          </Box>

          {/* Right side - Empty space */}
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={desktopOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: desktopOpen ? 280 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            position: 'fixed',
            top: 64, // Height of AppBar
            left: 0,
            height: 'calc(100vh - 64px)',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            zIndex: theme.zIndex.drawer,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
