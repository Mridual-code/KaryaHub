import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import { USER_ROLES } from "./utils/constants";

// ---------------- Admin ----------------
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployees from "./pages/admin/Employees";
import AdminDepartments from "./pages/admin/Departments";
import AdminAttendance from "./pages/admin/Attendance";
import AdminLeaveRequests from "./pages/admin/LeaveRequests";
import AdminReports from "./pages/admin/Reports";
import AdminNotifications from "./pages/admin/Notifications";
import AdminActivityLogs from "./pages/admin/ActivityLogs";
import AdminProfile from "./pages/admin/Profile";

// ---------------- HR ----------------
import HRDashboard from "./pages/hr/Dashboard";
import Employees from "./pages/hr/Employees";
import Attendance from "./pages/hr/Attendance";
import LeaveRequests from "./pages/hr/LeaveRequests";
import Reports from "./pages/hr/Reports";
import Notifications from "./pages/hr/Notifications";
import Profile from "./pages/hr/Profile";

// ---------------- Employee ----------------
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeAttendance from "./pages/employee/Attendance";
import EmployeeLeaves from "./pages/employee/Leaves";
import EmployeeNotifications from "./pages/employee/Notifications";
import EmployeeProfile from "./pages/employee/Profile";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* ================= ADMIN ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  USER_ROLES.ADMIN,
                ]}
              />
            }
          >
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/employees"
              element={<AdminEmployees />}
            />

            <Route
              path="/admin/departments"
              element={<AdminDepartments />}
            />

            <Route
              path="/admin/attendance"
              element={<AdminAttendance />}
            />

            <Route
              path="/admin/leave"
              element={<AdminLeaveRequests />}
            />

            <Route
              path="/admin/reports"
              element={<AdminReports />}
            />

            <Route
              path="/admin/notifications"
              element={<AdminNotifications />}
            />

            <Route
              path="/admin/activity-logs"
              element={<AdminActivityLogs />}
            />

            <Route
              path="/admin/profile"
              element={<AdminProfile />}
            />
          </Route>

          {/* ================= HR ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  USER_ROLES.HR,
                ]}
              />
            }
          >
            <Route
              path="/hr"
              element={<HRDashboard />}
            />

            <Route
              path="/hr/employees"
              element={<Employees />}
            />

            <Route
              path="/hr/departments"
              element={<AdminDepartments />}
            />

            <Route
              path="/hr/attendance"
              element={<Attendance />}
            />

            <Route
              path="/hr/leave"
              element={<LeaveRequests />}
            />

            <Route
              path="/hr/reports"
              element={<Reports />}
            />

            <Route
              path="/hr/notifications"
              element={<Notifications />}
            />

            <Route
              path="/hr/profile"
              element={<Profile />}
            />
          </Route>

          {/* ================= EMPLOYEE ================= */}

          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  USER_ROLES.EMPLOYEE,
                ]}
              />
            }
          >
            <Route
              path="/employee"
              element={<EmployeeDashboard />}
            />

            <Route
              path="/employee/attendance"
              element={<EmployeeAttendance />}
            />

            <Route
              path="/employee/leave"
              element={<EmployeeLeaves />}
            />

            <Route
              path="/employee/notifications"
              element={<EmployeeNotifications />}
            />

            <Route
              path="/employee/profile"
              element={<EmployeeProfile />}
            />
          </Route>

        </Route>
      </Route>

      {/* Catch All */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;