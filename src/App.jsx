import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminOnly from "./components/AdminOnly";
import Overview from "./pages/dashboard/Overview";
import Inventory from "./pages/dashboard/Inventory";
import Assignment from "./pages/dashboard/Assignment";
import Maintenance from "./pages/dashboard/Maintenance";
import Available from "./pages/dashboard/Available";
import Reports from "./pages/dashboard/Reports";
import Users from "./pages/dashboard/Users";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route
          index
          element={
            <AdminOnly>
              <Overview />
            </AdminOnly>
          }
        />
        <Route path="inventory" element={<Inventory />} />
        <Route
          path="assignment"
          element={
            <AdminOnly>
              <Assignment />
            </AdminOnly>
          }
        />
        <Route
          path="maintenance"
          element={
            <AdminOnly>
              <Maintenance />
            </AdminOnly>
          }
        />
        <Route
          path="available"
          element={
            <AdminOnly>
              <Available />
            </AdminOnly>
          }
        />
        <Route path="reports" element={<Reports />} />
        <Route
          path="users"
          element={
            <AdminOnly>
              <Users />
            </AdminOnly>
          }
        />
        <Route
          path="profile"
          element={
            <AdminOnly>
              <Profile />
            </AdminOnly>
          }
        />
        <Route
          path="settings"
          element={
            <AdminOnly>
              <Settings />
            </AdminOnly>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
