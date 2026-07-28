import {
  FaBuilding,
  FaCalendarCheck,
  FaChartBar,
  FaClipboardList,
  FaHome,
  FaIdBadge,
  FaUsers
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { USER_ROLES } from "../../utils/constants";

function Sidebar({ sidebarOpen }) {
  const { user } = useAuth();

  const adminLinks = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <FaHome />
    },
    {
      label: "Employees",
      path: "/admin/employees",
      icon: <FaUsers />
    },
    {
      label: "Departments",
      path: "/admin/departments",
      icon: <FaBuilding />
    },
    {
      label: "Attendance",
      path: "/admin/attendance",
      icon: <FaCalendarCheck />
    },
    {
      label: "Leave Requests",
      path: "/admin/leave",
      icon: <FaClipboardList />
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: <FaChartBar />
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: <FaIdBadge />
    }
  ];

  const hrLinks = [
    {
      label: "Dashboard",
      path: "/hr",
      icon: <FaHome />
    },
    {
      label: "Employees",
      path: "/hr/employees",
      icon: <FaUsers />
    },
    {
      label: "Attendance",
      path: "/hr/attendance",
      icon: <FaCalendarCheck />
    },
    {
      label: "Leave Requests",
      path: "/hr/leave",
      icon: <FaClipboardList />
    },
    {
      label: "Profile",
      path: "/hr/profile",
      icon: <FaIdBadge />
    }
  ];

  const employeeLinks = [
    {
      label: "Dashboard",
      path: "/employee",
      icon: <FaHome />
    },
    {
      label: "Attendance",
      path: "/employee/attendance",
      icon: <FaCalendarCheck />
    },
    {
      label: "My Leave",
      path: "/employee/leave",
      icon: <FaClipboardList />
    },
    {
      label: "Profile",
      path: "/employee/profile",
      icon: <FaIdBadge />
    }
  ];

  let links = employeeLinks;

  if (user?.role === USER_ROLES.ADMIN) {
    links = adminLinks;
  } else if (
    user?.role === USER_ROLES.HR
  ) {
    links = hrLinks;
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          K
        </div>

        {sidebarOpen && (
          <h2>KaryaHub</h2>
        )}
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={
              link.path === "/admin" ||
              link.path === "/hr" ||
              link.path === "/employee"
            }
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
            title={
              sidebarOpen
                ? ""
                : link.label
            }
          >
            <span className="sidebar-icon">
              {link.icon}
            </span>

            {sidebarOpen && (
              <span className="sidebar-label">
                {link.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;