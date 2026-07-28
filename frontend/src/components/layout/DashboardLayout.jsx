import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <div
      className={`dashboard-layout ${
        sidebarOpen
          ? "sidebar-expanded"
          : "sidebar-collapsed"
      }`}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
      />

      <div className="dashboard-main">
        <Navbar
          toggleSidebar={toggleSidebar}
        />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;