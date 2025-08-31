import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loginscreen from "./pages/auth/loginScreen";
import RegisterScreen from "./pages/auth/registerScreen";
import HomeAdmin from "./pages/admin/homeAdmin";
import HomeManager from "./pages/manager/homeManager";
import HomeStaff from "./pages/staff/homeStaff";
function App() {
  return (
    <Router>
      <Routes>
        --- phần route của auth ----
        
        <Route path="/" element={<Loginscreen />} />
        <Route path="/register" element={<RegisterScreen  />} />
        <Route path="/admin-home" element={<HomeAdmin />} />
        <Route path="/manager-home" element={<HomeManager />} />
        <Route path="/staff-home" element={<HomeStaff />} />

        --- phần route của admin ----





        --- phần route của manager ----






        --- phần route của staff ----





      </Routes>
    </Router>
  );
}

export default App;
