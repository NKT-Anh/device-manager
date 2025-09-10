import { Route, Routes, useLocation, Navigate } from "react-router-dom";
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
import InventoryPage from './components/Equipment/InventoryPage';
import StaffList from './components/Staff/StaffList';
import ErrorBoundary from './components/Layout/ErrorBoundary';
import SuppliersPage from './pages/manager/SuppliersPage';
import OrdersPage from './pages/manager/OrdersPage';
import NotificationsPage from './pages/manager/NotificationsPage';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { AuthProvider } from './context/authContext';
import LayoutStaff from "./pages/staff/layoutStaff";
import ProfileScreen from "./pages/staff/profileScreen";
import ReportsStaff from "./pages/staff/reportsStaff";
import UsersStaff from "./pages/staff/usersStaff/usersStaff";
import HistoryStaff from "./pages/staff/historyStaff";
import DevicesStaff from "./pages/staff/devicesStaff";
import NotificationsStaff from "./pages/staff/notificationsStaff";
import DeviceHistory from "./pages/staff/deviceHistory";
import PanelUseDevice from "./pages/staff/usersStaff/panelUseDevice";
import DeviceReportsScreen from "./pages/staff/DeviceReportsScreen";

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

  const getCurrentRole = (): "manager" | "staff" | null => {
    try {
      const cached = localStorage.getItem('currentUser');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return parsed?.role ?? null;
    } catch {
      return null;
    }
  };

  const ProtectedRoute = ({ element, allowedRoles }: { element: React.ReactElement; allowedRoles: Array<"manager" | "staff"> }) => {
    const role = getCurrentRole();
    if (!role) {
      return <Navigate to="/" replace />;
    }
    if (!allowedRoles.includes(role)) {
      // Redirect user to their appropriate home if they hit a forbidden route
      return <Navigate to={role === 'manager' ? '/manager-home' : '/staff-home'} replace />;
    }
    return element;
  };

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
          {getCurrentRole() !== 'staff' && (
            <ErrorBoundary>
              <Navigation />
            </ErrorBoundary>
          )}
          <Box
            component="main"
            sx={{
              pt: getCurrentRole() === 'staff' ? 2 : { xs: 7, md: 8 },
              ml: getCurrentRole() === 'staff' ? 0 : { xs: 0, md: desktopOpen ? '280px' : 0 },
              backgroundColor: '#f5f5f5',
              minHeight: 'calc(100vh - 64px)',
              transition: 'margin-left 0.3s ease',
            }}
          >
            <Routes>
              <Route path="/admin-home" element={<ProtectedRoute element={<HomeAdmin />} allowedRoles={["manager"]} />} />
              <Route path="/manager-home" element={<ProtectedRoute element={<HomeManager />} allowedRoles={["manager"]} />} />
              {/* Optional: keep staff-home to redirect to the new layout if someone hits old URL */}
              <Route path="/staff-home" element={<ProtectedRoute element={<Navigate to="/staff" replace />} allowedRoles={["staff"]} />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["manager"]} />} />
              <Route path="/facilities" element={<ProtectedRoute element={<FacilityList />} allowedRoles={["manager"]} />} />
              <Route path="/employees" element={<ProtectedRoute element={<StaffList />} allowedRoles={["manager"]} />} />
              <Route path="/suppliers" element={<ProtectedRoute element={<SuppliersPage />} allowedRoles={["manager"]} />} />
              <Route path="/orders" element={<ProtectedRoute element={<OrdersPage />} allowedRoles={["manager"]} />} />
              <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} allowedRoles={["manager"]} />} />
              <Route path="/inventory" element={<ProtectedRoute element={<InventoryPage />} allowedRoles={["manager"]} />} />
              {/* Nested staff routes from other branch, behind staff role */}
              <Route path="/staff" element={<ProtectedRoute element={<LayoutStaff />} allowedRoles={["staff"]} />}>
                <Route index element={<HomeStaff />} />
                <Route path="tasks" element={<div style={{ padding: 20 }}>Trang công việc</div>} />
                <Route path="devices" element={<DevicesStaff />} />
                <Route path="deviceReportsScreen" element={<DeviceReportsScreen />} />
                <Route path="notifications" element={<NotificationsStaff />} />
                <Route path="profile" element={<ProfileScreen />} />
                <Route path="panelUseDevice" element={<PanelUseDevice />} />
                <Route path="history" element={<DeviceHistory />} />
                <Route path="historyStaff" element={<HistoryStaff />} />
                <Route path="users" element={<UsersStaff />} />
                <Route path="reports" element={<ReportsStaff />} />
              </Route>
            </Routes>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
