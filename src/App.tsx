import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loginscreen from "./pages/auth/loginScreen";
import RegisterScreen from "./pages/auth/registerScreen";
import HomeAdmin from "./pages/admin/homeAdmin";
import HomeManager from "./pages/manager/homeManager";
import HomeStaff from "./pages/staff/homeStaff";
import LayoutStaff from "./pages/staff/layoutStaff";
import ReportsStaff from "./pages/staff/reportsStaff";
import UsersStaff from "./pages/staff/usersStaff";
import HistoryStaff from "./pages/staff/historyStaff";
function App() {
  return (
    <Router>
      <Routes>
        --- phần route của auth ----
        
        <Route path="/" element={<Loginscreen />} />
        <Route path="/register" element={<RegisterScreen  />} />
        <Route path="/admin-home" element={<HomeAdmin />} />
        <Route path="/manager-home" element={<HomeManager />} />
        <Route path="/staff" element={<HomeStaff />} />

        --- phần route của admin ----





        --- phần route của manager ----






        --- phần route của staff ----
              <Route path="/staff" element={<LayoutStaff />}>
          <Route index element={<HomeStaff />} />
          {/* <Route path="tasks" element={<TasksPage />} /> */}
          {/* <Route path="devices" element={<DevicesPage />} /> */}
          <Route path="reports" element={<ReportsStaff />} />
          <Route path="reports" element={<ReportsStaff />} />
          <Route path="users" element={<UsersStaff />} />
          <Route path="history" element={<HistoryStaff />} />
        </Route>




      </Routes>
    </Router>
  );
}

export default App;
