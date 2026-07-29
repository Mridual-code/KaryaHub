import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import attendanceService from "../../services/attendanceService";

import TodayAttendanceCard from "../../components/attendance/TodayAttendanceCard";
import CheckInOutCard from "../../components/attendance/CheckInOutCard";
import AttendanceCalendar from "../../components/attendance/AttendanceCalendar";
import AttendanceHistory from "../../components/attendance/AttendanceHistory";

function Attendance() {
  const [todayAttendance, setTodayAttendance] = useState(null);

  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const [today, history] = await Promise.all([
        attendanceService.getTodayAttendance(),
        attendanceService.getMyAttendance(),
      ]);

      setTodayAttendance(today.attendance || null);
      setAttendanceHistory(history.attendance || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceService.checkIn();

      toast.success("Checked in successfully");

      await fetchAttendance();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Check-in failed"
      );
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();

      toast.success("Checked out successfully");

      await fetchAttendance();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Check-out failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="table-card">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="employee-attendance-page">
      <h2>My Attendance</h2>

      <TodayAttendanceCard
    today={todayAttendance}
/>

<CheckInOutCard
    today={todayAttendance}
    onCheckIn={handleCheckIn}
    onCheckOut={handleCheckOut}
    loading={loading}
/>

      <AttendanceCalendar />

      <AttendanceHistory
        attendance={attendanceHistory}
      />
    </div>
  );
}

export default Attendance;