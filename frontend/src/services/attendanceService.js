import API from "../api/axios";

/*
|--------------------------------------------------------------------------
| Employee Attendance
|--------------------------------------------------------------------------
*/

// Check In
export const checkIn = async () => {
  const res = await API.post("/attendance/check-in");
  return res.data;
};

// Check Out
export const checkOut = async () => {
  const res = await API.patch("/attendance/check-out");
  return res.data;
};

// Today's Attendance
export const getTodayAttendance = async () => {
  const res = await API.get("/attendance/today");
  return res.data;
};

// My Attendance History
export const getMyAttendance = async (params = {}) => {
  const res = await API.get("/attendance/my", {
    params,
  });

  return res.data;
};

/*
|--------------------------------------------------------------------------
| Attendance Calendar
|--------------------------------------------------------------------------
*/

// Employee Calendar
export const getMyAttendanceCalendar = async (
  month,
  year
) => {
  const res = await API.get("/attendance-calendar/my", {
    params: {
      month,
      year,
    },
  });

  return res.data;
};

// Admin / HR View Employee Calendar
export const getEmployeeAttendanceCalendar =
  async (
    employeeId,
    month,
    year
  ) => {
    const res = await API.get(
      `/attendance-calendar/employee/${employeeId}`,
      {
        params: {
          month,
          year,
        },
      }
    );

    return res.data;
  };

/*
|--------------------------------------------------------------------------
| Admin / HR Attendance
|--------------------------------------------------------------------------
*/

// Attendance List
export const getAttendance = async (
  filters = {}
) => {
  const res = await API.get("/attendance", {
    params: filters,
  });

  return res.data;
};

// Mark Attendance
export const markAttendance = async (
  data
) => {
  const res = await API.post(
    "/attendance/mark",
    data
  );

  return res.data;
};

// Update Attendance
export const updateAttendance = async (
  id,
  data
) => {
  const res = await API.put(
    `/attendance/${id}`,
    data
  );

  return res.data;
};

// Attendance Statistics
export const getAttendanceStats =
  async (date) => {
    const res = await API.get(
      "/attendance/stats",
      {
        params: { date },
      }
    );

    return res.data;
  };

/*
|--------------------------------------------------------------------------
| Default Export
|--------------------------------------------------------------------------
*/

export default {
  // Employee
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendance,

  // Calendar
  getMyAttendanceCalendar,
  getEmployeeAttendanceCalendar,

  // Admin / HR
  getAttendance,
  markAttendance,
  updateAttendance,
  getAttendanceStats,
};