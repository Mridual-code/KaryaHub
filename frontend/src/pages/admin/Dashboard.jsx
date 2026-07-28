import { useEffect, useState } from "react";

import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaCalendarAlt,
} from "react-icons/fa";

import dashboardService from "../../services/dashboardService";

import StatCard from "../../components/common/StatCard";
import ChartCard from "../../components/common/ChartCard";
import RecentEmployees from "../../components/common/RecentEmployees";
import RecentLeaves from "../../components/common/RecentLeaves";

import { useAuth } from "../../hooks/useAuth";

function Dashboard() {

  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const data =
  await dashboardService.getDashboard(
    user?.role
  );

        setDashboard(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  const getGreeting = () => {

    const hour =
      new Date().getHours();

    if (hour < 12)
      return "Good Morning";

    if (hour < 18)
      return "Good Afternoon";

    return "Good Evening";

  };

  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyHiringData =
    dashboard?.charts?.monthlyHiring?.map(
      (item) => ({
        ...item,
        month:
          monthNames[item.month],
      })
    ) || [];

  if (loading)
    return (
      <div className="dashboard-loader">
        Loading Dashboard...
      </div>
    );

  const summary =
    dashboard?.summary || {};

  return (

    <div className="dashboard-page">

      {/* Welcome */}

      <div className="dashboard-welcome">

        <h1>
          {getGreeting()},
          {" "}
          {user?.name}
          {" "}
          👋
        </h1>

        <p>
          Welcome back to
          {" "}
          <strong>
            KaryaHub
          </strong>.
          Manage employees,
          attendance,
          departments,
          leave requests
          and reports
          from one place.
        </p>

      </div>

      {/* Summary */}

      <div className="dashboard-summary">

        <StatCard
          title="Employees"
          value={summary.totalEmployees}
          icon={<FaUsers />}
          color="#2563eb"
        />

        <StatCard
          title="Present Today"
          value={summary.presentToday}
          icon={<FaUserCheck />}
          color="#22c55e"
        />

        <StatCard
          title="Pending Leaves"
          value={
            summary.pendingLeaveRequests
          }
          icon={<FaCalendarAlt />}
          color="#f59e0b"
        />

        <StatCard
          title="Departments"
          value={summary.totalDepartments}
          icon={<FaBuilding />}
          color="#14b8a6"
        />

      </div>

      {/* Main Chart */}

      <div className="dashboard-chart-section">

        <ChartCard
          title="Monthly Hiring"
          data={monthlyHiringData}
          xKey="month"
          dataKey="employeesJoined"
          color="#3b82f6"
        />

      </div>
       

      {/* Recent Data */}

      <div className="dashboard-recent">

        <RecentEmployees
          employees={
            dashboard?.recent
              ?.employees || []
          }
        />

        <RecentLeaves
          leaves={
            dashboard?.recent
              ?.leaveRequests || []
          }
        />

      </div>

    </div>

  );

}

export default Dashboard;