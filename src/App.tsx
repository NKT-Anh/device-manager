import { Route, Routes, useLocation } from "react-router-dom";
import Loginscreen from "./pages/auth/loginScreen";
import RegisterScreen from "./pages/auth/registerScreen";
import HomeAdmin from "./pages/admin/homeAdmin";
import HomeManager from "./pages/manager/homeManager";
import HomeStaff from "./pages/staff/homeStaff";
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Layout/Navigation';
import Dashboard from './pages/manager/Dashboard';
import FacilityList from './components/Facility/FacilityList';
import StaffList from './components/Staff/StaffList';
import ErrorBoundary from './components/Layout/ErrorBoundary';

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

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const location = useLocation();
  const isAuthRoute = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/forgot-password';

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard key="dashboard" />;
      case 'facilities':
        return <FacilityList key="facilities" />;
      case 'staff':
        return <StaffList key="staff" />;
      default:
        return <Dashboard key="dashboard-default" />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
          <Route path="/" element={<Loginscreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/admin-home" element={<HomeAdmin />} />
          <Route path="/manager-home" element={<HomeManager />} />
          <Route path="/staff-home" element={<HomeStaff />} />
        </Routes>

        {!isAuthRoute && (
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: 8,
              backgroundColor: '#f5f5f5',
              minHeight: 'calc(100vh - 64px)'
            }}
          >
            <ErrorBoundary>
              <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
              {renderPage()}
            </ErrorBoundary>
          </Box>
        )}
    </ThemeProvider>
  );
}

export default App;
