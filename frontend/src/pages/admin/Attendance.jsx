import { useEffect, useMemo, useState } from "react";

import attendanceService from "../../services/attendanceService";

import AttendanceToolbar from "../../components/attendance/AttendanceToolbar";
import AttendanceFilters from "../../components/attendance/AttendanceFilters";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceModal from "../../components/attendance/AttendanceModal";
import AttendanceStats from "../../components/attendance/AttendanceStats";

function Attendance() {

    const [attendance, setAttendance] = useState([]);
    const [stats, setStats] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [date, setDate] =
        useState("");

    const [selectedAttendance, setSelectedAttendance] =
        useState(null);

    const [modalOpen, setModalOpen] =
        useState(false);
        const [department, setDepartment] =
    useState("");

    const fetchAttendance = async () => {

        try {

            setLoading(true);

            const [attendanceData, statsData] =
                await Promise.all([

                    attendanceService.getAttendance(),

                    attendanceService.getAttendanceStats(),

                ]);

            setAttendance(
                attendanceData.attendance || []
            );

            setStats(
                statsData.stats || {}
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAttendance();

    }, []);

    const filteredAttendance =
        useMemo(() => {

            return attendance.filter((item) => {

                const matchesSearch =
                    item.employee?.user?.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesStatus =
                    !status ||
                    item.status === status;

                const matchesDate =
                    !date ||
                    item.date?.slice(0, 10) === date;
                    const matchesDepartment =
    !department ||
    item.employee?.department?.name ===
        department;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesDate &&
                    matchesDepartment
                );

            });

        }, [
            attendance,
            search,
            status,
            date,
            department
        ]);

    const handleEdit = (item) => {

        setSelectedAttendance(item);

        setModalOpen(true);

    };

    const handleSave = async (form) => {

    try {

        if (selectedAttendance) {

            await attendanceService.updateAttendance(
                selectedAttendance._id,
                form
            );

        } else {

            await attendanceService.markAttendance(form);

        }

        setModalOpen(false);

        setSelectedAttendance(null);

        fetchAttendance();

    } catch (err) {

        console.log(err);

    }

};

    return (

        <div className="attendance-page">

            <div className="page-header">

                <div>

                    <h2>
                        Attendance Management
                    </h2>

                    <p>
                        Manage employee attendance records.
                    </p>

                </div>

            </div>

            <AttendanceStats stats={stats} />

            <AttendanceToolbar
    search={search}
    setSearch={setSearch}
    date={date}
    setDate={setDate}
    onRefresh={fetchAttendance}
    onExport={() => {
        console.log("Export CSV");
    }}
    onMarkAttendance={() => {
        setSelectedAttendance(null);
        setModalOpen(true);
    }}
/>

            <AttendanceFilters
    status={status}
    setStatus={setStatus}
    department={department}
    setDepartment={setDepartment}
    onReset={() => {
        setSearch("");
        setStatus("");
        setDepartment("");
        setDate("");
    }}
/>

            {loading ? (

                <div className="table-card">
                    Loading attendance...
                </div>

            ) : (

                <AttendanceTable
    attendance={filteredAttendance}
    onEdit={handleEdit}
    onViewCalendar={(employeeId) => {
        console.log(employeeId);
    }}
/>
            )}

            <AttendanceModal
                open={modalOpen}
                initialData={selectedAttendance}
                onClose={() => {

    setModalOpen(false);

    setSelectedAttendance(null);

}}
                onSave={handleSave}
            />

        </div>

    );

}

export default Attendance;