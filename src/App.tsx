import { Route, Routes, useLocation } from "react-router-dom";
import Loginscreen from "./pages/auth/loginScreen";
import RegisterScreen from "./pages/auth/registerScreen";
import HomeAdmin from "./pages/admin/homeAdmin";
import HomeManager from "./pages/manager/homeManager";
import HomeStaff from "./pages/staff/homeStaff";
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Layout/Navigation';
import Dashboard from './pages/manager/Dashboard';
import FacilityList from './components/Facility/FacilityList';
import StaffList from './components/Staff/StaffList';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import SuppliersPage from './pages/manager/SuppliersPage';
import OrdersPage from './pages/manager/OrdersPage';
import NotificationsPage from './pages/manager/NotificationsPage';
import { SidebarProvider, useSidebar } from './context/SidebarContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

function AppContent() {
  const location = useLocation();
  const { desktopOpen } = useSidebar();
  const isAuthRoute = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/forgot-password';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthRoute ? (
        <Routes>
          <Route path="/" element={<Loginscreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      ) : (
        <>
          <ErrorBoundary>
            <Navigation />
          </ErrorBoundary>
          <Box
            component="main"
            sx={{
              pt: { xs: 7, md: 8 },
              ml: { xs: 0, md: desktopOpen ? '280px' : 0 },
              backgroundColor: '#f5f5f5',
              minHeight: 'calc(100vh - 64px)',
              transition: 'margin-left 0.3s ease',
            }}
          >
            <Routes>
              <Route path="/admin-home" element={<HomeAdmin />} />
              <Route path="/manager-home" element={<HomeManager />} />
              <Route path="/staff-home" element={<HomeStaff />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/facilities" element={<FacilityList />} />
              <Route path="/staff" element={<StaffList />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
}

function App() {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
}

export default App;
