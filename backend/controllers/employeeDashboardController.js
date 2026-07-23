const Employee = require(
  "../models/Employee"
);

const Attendance = require(
  "../models/Attendance"
);

const LeaveRequest = require(
  "../models/LeaveRequest"
);

const getStartOfDay = require(
  "../utils/getStartOfDay"
);

const getEmployeeDashboard = async (
  req,
  res
) => {
  try {
    const employee =
      await Employee.findOne({
        user: req.user._id
      })
        .populate(
          "user",
          "name email role"
        )
        .populate(
          "department",
          "name"
        );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message:
          "Employee profile not found"
      });
    }

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const todayStart =
      getStartOfDay(new Date());

    const todayEnd =
      new Date(todayStart);

    todayEnd.setDate(
      todayEnd.getDate() + 1
    );

    const [
      presentDays,
      absentDays,
      leaveDays,
      halfDays,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      recentAttendance,
      recentLeaves,
      todayAttendance
    ] = await Promise.all([
      Attendance.countDocuments({
        employee: employee._id,
        status: "Present",
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }),

      Attendance.countDocuments({
        employee: employee._id,
        status: "Absent",
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }),

      Attendance.countDocuments({
        employee: employee._id,
        status: "On Leave",
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }),

      Attendance.countDocuments({
        employee: employee._id,
        status: "Half Day",
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }),

      LeaveRequest.countDocuments({
        employee: employee._id,
        status: "Pending"
      }),

      LeaveRequest.countDocuments({
        employee: employee._id,
        status: "Approved"
      }),

      LeaveRequest.countDocuments({
        employee: employee._id,
        status: "Rejected"
      }),

      Attendance.find({
        employee: employee._id
      })
        .sort({
          date: -1
        })
        .limit(5),

      LeaveRequest.find({
        employee: employee._id
      })
        .sort({
          createdAt: -1
        })
        .limit(5),

      Attendance.findOne({
        employee: employee._id,
        date: {
          $gte: todayStart,
          $lt: todayEnd
        }
      })
    ]);

    const recordedDays =
      presentDays +
      absentDays +
      leaveDays +
      halfDays;

    const attendancePercentage =
      recordedDays > 0
        ? Number(
            (
              ((presentDays +
                halfDays * 0.5) /
                recordedDays) *
              100
            ).toFixed(2)
          )
        : 0;

    return res.status(200).json({
      success: true,
      message:
        "Employee dashboard fetched successfully",

      employee: {
        id: employee._id,
        employeeId:
          employee.employeeId,
        name:
          employee.user?.name,
        email:
          employee.user?.email,
        department:
          employee.department?.name,
        designation:
          employee.designation,
        employmentStatus:
          employee.employmentStatus,
        profilePicture:
          employee.profilePicture || ""
      },

      statistics: {
        presentDays,
        absentDays,
        leaveDays,
        halfDays,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        recordedDays,
        attendancePercentage
      },

      todayAttendance,

      recent: {
        attendance:
          recentAttendance,
        leaves:
          recentLeaves
      }
    });
  } catch (error) {
    console.error(
      "Employee dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load employee dashboard"
    });
  }
};

module.exports = {
  getEmployeeDashboard
};