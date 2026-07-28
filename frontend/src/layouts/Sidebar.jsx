import {
  FaBell,
  FaBuilding,
  FaCalendarCheck,
  FaChartBar,
  FaClipboardList,
  FaHistory,
  FaHome,
  FaIdBadge,
  FaUsers
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { USER_ROLES } from "../../utils/constants";
function Sidebar() {
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
  label: "Notifications",
  path: "/admin/notifications",
  icon: <FaBell />
},
{
  label: "Activity Logs",
  path: "/admin/activity-logs",
  icon: <FaHistory />
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
    icon: <FaHome />,
  },
  {
    label: "Employees",
    path: "/hr/employees",
    icon: <FaUsers />,
  },
  {
    label: "Departments",
    path: "/hr/departments",
    icon: <FaBuilding />,
  },
  {
    label: "Attendance",
    path: "/hr/attendance",
    icon: <FaCalendarCheck />,
  },
  {
    label: "Leave Requests",
    path: "/hr/leave",
    icon: <FaClipboardList />,
  },
  {
    label: "Reports",
    path: "/hr/reports",
    icon: <FaChartBar />,
  },
  {
    label: "Notifications",
    path: "/hr/notifications",
    icon: <FaBell />,
  },
  {
    label: "Profile",
    path: "/hr/profile",
    icon: <FaIdBadge />,
  },
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
  label: "Notifications",
  path: "/employee/notifications",
  icon: <FaBell />
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
  } else if (user?.role === USER_ROLES.HR) {
    links = hrLinks;
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <h2>KaryaHub</h2>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin" ||
              link.path === "/hr" ||
              link.path === "/employee"}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span className="sidebar-icon">
              {link.icon}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;