import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loginscreen from "./pages/auth/loginScreen";
import RegisterScreen from "./pages/auth/registerScreen";
import HomeAdmin from "./pages/admin/homeAdmin";
import HomeManager from "./pages/manager/homeManager";
import HomeStaff from "./pages/staff/homeStaff";
import LayoutStaff from "./pages/staff/layoutStaff";
import ProfileScreen from "./pages/staff/profileScreen";
import ReportsStaff from "./pages/staff/reportsStaff";
import UsersStaff from "./pages/staff/usersStaff/usersStaff";
import HistoryStaff from "./pages/staff/historyStaff";
import DevicesStaff from "./pages/staff/devicesStaff";
import NotificationsStaff from "./pages/staff/notificationsStaff";
import DeviceHistory from "./pages/staff/deviceHistory";
import { AuthProvider } from "./context/authContext";
import PanelUseDevice from "./pages/staff/usersStaff/panelUseDevice";
import DeviceReportsScreen from "./pages/staff/DeviceReportsScreen";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- phần route của auth ---- */}
          <Route path="/" element={<Loginscreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/admin-home" element={<HomeAdmin />} />
          <Route path="/manager-home" element={<HomeManager />} />
          <Route path="/staff" element={<HomeStaff />} />

          {/* --- phần route của admin ---- */}
          {/* Thêm route admin ở đây nếu có */}

          {/* --- phần route của manager ---- */}
          {/* Thêm route manager ở đây nếu có */}

          {/* --- phần route của staff ---- */}
          <Route path="/staff" element={<LayoutStaff />}>
            <Route index element={<HomeStaff />} />
            {/* giữ cả 2 phần devices */}
            <Route path="devices" element={<DevicesStaff />} />
            <Route path="deviceReportsScreen" element={<DeviceReportsScreen />} />
            {/* staff reports */}
            <Route path="reports" element={<ReportsStaff />} />
            {/* profile */}
            <Route path="profile" element={<ProfileScreen />} />
            {/* users */}
            <Route path="users" element={<UsersStaff />} />
            <Route path="panelUseDevice" element={<PanelUseDevice />} />
            {/* history */}
            <Route path="history" element={<DeviceHistory />} />
            <Route path="historyStaff" element={<HistoryStaff />} />
            {/* notifications */}
            <Route path="notifications" element={<NotificationsStaff />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
