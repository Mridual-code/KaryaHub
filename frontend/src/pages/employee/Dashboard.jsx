import { useEffect, useState } from "react";

import dashboardService from "../../services/dashboardService";

import EmployeeWelcome from "../../components/dashboard/EmployeeWelcome";
import EmployeeStats from "../../components/dashboard/EmployeeStats";
import TodayAttendanceCard from "../../components/dashboard/TodayAttendanceCard";
import LeaveSummaryCard from "../../components/dashboard/LeaveSummaryCard";
import RecentAttendance from "../../components/dashboard/RecentAttendance";
import NotificationCard from "../../components/notifications/NotificationCard";

function EmployeeDashboard() {

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data =
                await dashboardService.getEmployeeDashboard();

            setDashboard(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <main className="page">

                <p>Loading dashboard...</p>

            </main>

        );

    }

    return (

        <main className="page dashboard-page">

            <EmployeeWelcome
                employee={dashboard.employee}
            />

            <EmployeeStats
                statistics={dashboard.statistics}
            />

            <div className="dashboard-grid">

                <TodayAttendanceCard
                    attendance={
                        dashboard.todayAttendance
                    }
                />

                <LeaveSummaryCard
                    statistics={
                        dashboard.statistics
                    }
                />

            </div>

            <div className="dashboard-grid">

                <RecentAttendance
                    attendance={
                        dashboard.recent.attendance
                    }
                />

                <div className="dashboard-card">
    <h3>Recent Notifications</h3>
    <p>No notifications yet.</p>
</div>

            </div>

        </main>

    );

}

export default EmployeeDashboard;