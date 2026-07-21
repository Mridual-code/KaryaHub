const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

const getTodayRange = () => {
  const startOfToday = new Date();

  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(
    startOfToday
  );

  startOfTomorrow.setDate(
    startOfTomorrow.getDate() + 1
  );

  return {
    startOfToday,
    startOfTomorrow
  };
};

const getMonthNames = () => {
  return [
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
    "Dec"
  ];
};

/*
|--------------------------------------------------------------------------
| Employees by Department
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/department
*/

const getDepartmentChart = async (
  req,
  res
) => {
  try {
    const departmentData =
      await Employee.aggregate([
        {
          $group: {
            _id: "$department",
            count: {
              $sum: 1
            }
          }
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "departmentDetails"
          }
        },
        {
          $unwind: {
            path: "$departmentDetails",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,

            departmentId: "$_id",

            department: {
              $ifNull: [
                "$departmentDetails.name",
                "Unassigned"
              ]
            },

            count: 1
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ]);

    return res.status(200).json({
      message:
        "Department chart data fetched successfully",

      data: departmentData
    });
  } catch (error) {
    console.error(
      "Department chart error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch department chart data"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Today's Attendance Overview
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/attendance
*/

const getAttendanceChart = async (
  req,
  res
) => {
  try {
    const {
      startOfToday,
      startOfTomorrow
    } = getTodayRange();

    const attendanceData =
      await Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lt: startOfTomorrow
            }
          }
        },
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1
            }
          }
        }
      ]);

    const chartData = {
      present: 0,
      absent: 0,
      halfDay: 0,
      onLeave: 0
    };

    attendanceData.forEach((item) => {
      if (item._id === "Present") {
        chartData.present = item.count;
      }

      if (item._id === "Absent") {
        chartData.absent = item.count;
      }

      if (item._id === "Half Day") {
        chartData.halfDay = item.count;
      }

      if (item._id === "On Leave") {
        chartData.onLeave = item.count;
      }
    });

    return res.status(200).json({
      message:
        "Attendance chart data fetched successfully",

      date: startOfToday,

      data: chartData
    });
  } catch (error) {
    console.error(
      "Attendance chart error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance chart data"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Leave Request Overview
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/leaves
*/

const getLeaveChart = async (
  req,
  res
) => {
  try {
    const leaveData =
      await LeaveRequest.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1
            }
          }
        }
      ]);

    const chartData = {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    };

    leaveData.forEach((item) => {
      if (item._id === "Pending") {
        chartData.pending = item.count;
      }

      if (item._id === "Approved") {
        chartData.approved = item.count;
      }

      if (item._id === "Rejected") {
        chartData.rejected = item.count;
      }

      if (item._id === "Cancelled") {
        chartData.cancelled = item.count;
      }
    });

    return res.status(200).json({
      message:
        "Leave chart data fetched successfully",

      data: chartData
    });
  } catch (error) {
    console.error(
      "Leave chart error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch leave chart data"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Monthly Employee Hiring
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/hiring
|--------------------------------------------------------------------------
| Optional query:
| ?year=2026
*/

const getHiringChart = async (
  req,
  res
) => {
  try {
    const requestedYear = Number(
      req.query.year
    );

    const year =
      requestedYear ||
      new Date().getFullYear();

    if (
      Number.isNaN(year) ||
      year < 1900
    ) {
      return res.status(400).json({
        message: "Invalid year"
      });
    }

    const startOfYear = new Date(
      year,
      0,
      1
    );

    const startOfNextYear = new Date(
      year + 1,
      0,
      1
    );

    const hiringData =
      await Employee.aggregate([
        {
          $match: {
            joiningDate: {
              $gte: startOfYear,
              $lt: startOfNextYear
            }
          }
        },
        {
          $group: {
            _id: {
              $month: "$joiningDate"
            },

            employeesJoined: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);

    const monthNames = getMonthNames();

    const chartData = monthNames.map(
      (month, index) => {
        const monthRecord =
          hiringData.find(
            (item) =>
              item._id === index + 1
          );

        return {
          month,
          monthNumber: index + 1,

          employeesJoined:
            monthRecord?.employeesJoined ||
            0
        };
      }
    );

    return res.status(200).json({
      message:
        "Hiring chart data fetched successfully",

      year,

      data: chartData
    });
  } catch (error) {
    console.error(
      "Hiring chart error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch hiring chart data"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Attendance Trend
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/attendance-trend
|--------------------------------------------------------------------------
| Default: Last 30 days
| Optional query:
| ?days=7
| ?days=30
| ?days=60
| ?days=90
*/

const getAttendanceTrend = async (
  req,
  res
) => {
  try {
    let days = Number(
      req.query.days || 30
    );

    if (
      Number.isNaN(days) ||
      days < 1
    ) {
      return res.status(400).json({
        message:
          "Days must be a positive number"
      });
    }

    if (days > 365) {
      days = 365;
    }

    const endDate = new Date();

    endDate.setHours(
      23,
      59,
      59,
      999
    );

    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() -
        (days - 1)
    );

    startDate.setHours(0, 0, 0, 0);

    const attendanceData =
      await Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$date"
                }
              },

              status: "$status"
            },

            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            "_id.date": 1
          }
        }
      ]);

    const chartMap = {};

    attendanceData.forEach((item) => {
      const date = item._id.date;
      const status = item._id.status;

      if (!chartMap[date]) {
        chartMap[date] = {
          date,
          present: 0,
          absent: 0,
          halfDay: 0,
          onLeave: 0
        };
      }

      if (status === "Present") {
        chartMap[date].present =
          item.count;
      }

      if (status === "Absent") {
        chartMap[date].absent =
          item.count;
      }

      if (status === "Half Day") {
        chartMap[date].halfDay =
          item.count;
      }

      if (status === "On Leave") {
        chartMap[date].onLeave =
          item.count;
      }
    });

    const chartData = [];

    for (
      let index = 0;
      index < days;
      index++
    ) {
      const currentDate = new Date(
        startDate
      );

      currentDate.setDate(
        startDate.getDate() + index
      );

      const dateString =
        currentDate
          .toISOString()
          .split("T")[0];

      chartData.push(
        chartMap[dateString] || {
          date: dateString,
          present: 0,
          absent: 0,
          halfDay: 0,
          onLeave: 0
        }
      );
    }

    return res.status(200).json({
      message:
        "Attendance trend fetched successfully",

      range: {
        days,
        startDate,
        endDate
      },

      data: chartData
    });
  } catch (error) {
    console.error(
      "Attendance trend error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance trend"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Monthly Leave Trend
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/leave-trend
|--------------------------------------------------------------------------
| Optional query:
| ?year=2026
*/

const getLeaveTrend = async (
  req,
  res
) => {
  try {
    const requestedYear = Number(
      req.query.year
    );

    const year =
      requestedYear ||
      new Date().getFullYear();

    if (
      Number.isNaN(year) ||
      year < 1900
    ) {
      return res.status(400).json({
        message: "Invalid year"
      });
    }

    const startOfYear = new Date(
      year,
      0,
      1
    );

    const startOfNextYear = new Date(
      year + 1,
      0,
      1
    );

    const leaveData =
      await LeaveRequest.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfYear,
              $lt: startOfNextYear
            }
          }
        },
        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt"
              },

              status: "$status"
            },

            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            "_id.month": 1
          }
        }
      ]);

    const monthNames = getMonthNames();

    const chartData = monthNames.map(
      (month, index) => {
        const monthNumber = index + 1;

        const monthlyRecords =
          leaveData.filter(
            (item) =>
              item._id.month ===
              monthNumber
          );

        const result = {
          month,
          monthNumber,
          requests: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          cancelled: 0
        };

        monthlyRecords.forEach(
          (item) => {
            result.requests +=
              item.count;

            if (
              item._id.status ===
              "Pending"
            ) {
              result.pending =
                item.count;
            }

            if (
              item._id.status ===
              "Approved"
            ) {
              result.approved =
                item.count;
            }

            if (
              item._id.status ===
              "Rejected"
            ) {
              result.rejected =
                item.count;
            }

            if (
              item._id.status ===
              "Cancelled"
            ) {
              result.cancelled =
                item.count;
            }
          }
        );

        return result;
      }
    );

    return res.status(200).json({
      message:
        "Leave trend fetched successfully",

      year,

      data: chartData
    });
  } catch (error) {
    console.error(
      "Leave trend error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch leave trend"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Employee Status Overview
|--------------------------------------------------------------------------
| GET /api/dashboard/charts/status
*/

const getEmployeeStatusChart = async (
  req,
  res
) => {
  try {
    const statusData =
      await Employee.aggregate([
        {
          $group: {
            _id: "$employmentStatus",

            count: {
              $sum: 1
            }
          }
        }
      ]);

    const chartData = {
      active: 0,
      inactive: 0
    };

    statusData.forEach((item) => {
      if (item._id === "Active") {
        chartData.active = item.count;
      }

      if (item._id === "Inactive") {
        chartData.inactive =
          item.count;
      }
    });

    return res.status(200).json({
      message:
        "Employee status chart fetched successfully",

      data: chartData
    });
  } catch (error) {
    console.error(
      "Employee status chart error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch employee status chart"
    });
  }
};

module.exports = {
  getDepartmentChart,
  getAttendanceChart,
  getLeaveChart,
  getHiringChart,
  getAttendanceTrend,
  getLeaveTrend,
  getEmployeeStatusChart
};