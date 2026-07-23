const Employee = require(
  "../models/Employee"
);

const LeaveRequest = require(
  "../models/LeaveRequest"
);

const Attendance = require(
  "../models/Attendance"
);

const getStartOfDay = require(
  "../utils/getStartOfDay"
);

const getHrDashboard = async (
  req,
  res
) => {
  try {
    const today = getStartOfDay(
      new Date()
    );

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const [
      totalEmployees,
      activeEmployees,
      pendingLeaveRequests,
      presentToday,
      absentToday,
      halfDayToday,
      onLeaveToday,
      recentAttendance,
      recentLeaveRequests,
      recentEmployees
    ] = await Promise.all([
      Employee.countDocuments(),

      Employee.countDocuments({
        employmentStatus: "Active"
      }),

      LeaveRequest.countDocuments({
        status: "Pending"
      }),

      Attendance.countDocuments({
        date: {
          $gte: today,
          $lt: tomorrow
        },
        status: "Present"
      }),

      Attendance.countDocuments({
        date: {
          $gte: today,
          $lt: tomorrow
        },
        status: "Absent"
      }),

      Attendance.countDocuments({
        date: {
          $gte: today,
          $lt: tomorrow
        },
        status: "Half Day"
      }),

      Attendance.countDocuments({
        date: {
          $gte: today,
          $lt: tomorrow
        },
        status: "On Leave"
      }),

      Attendance.find()
        .populate({
          path: "employee",
          select:
            "employeeId designation department",
          populate: [
            {
              path: "user",
              select: "name email"
            },
            {
              path: "department",
              select: "name"
            }
          ]
        })
        .sort({
          date: -1,
          createdAt: -1
        })
        .limit(5),

      LeaveRequest.find()
        .populate({
          path: "employee",
          select:
            "employeeId designation department",
          populate: [
            {
              path: "user",
              select: "name email"
            },
            {
              path: "department",
              select: "name"
            }
          ]
        })
        .sort({
          createdAt: -1
        })
        .limit(5),

      Employee.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "department",
          "name"
        )
        .sort({
          createdAt: -1
        })
        .limit(5)
    ]);

    const markedToday =
      presentToday +
      absentToday +
      halfDayToday +
      onLeaveToday;

    const unmarkedToday = Math.max(
      activeEmployees - markedToday,
      0
    );

    return res.status(200).json({
      message:
        "HR dashboard fetched successfully",

      summary: {
        totalEmployees,
        activeEmployees,
        pendingLeaveRequests,
        presentToday,
        absentToday,
        halfDayToday,
        onLeaveToday,
        unmarkedToday
      },

      recent: {
        employees: recentEmployees,
        attendance: recentAttendance,
        leaveRequests:
          recentLeaveRequests
      }
    });
  } catch (error) {
    console.error(
      "HR dashboard error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch HR dashboard"
    });
  }
};

module.exports = {
  getHrDashboard
};