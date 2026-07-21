const Employee = require("../models/Employee");
const Department = require("../models/Department");
const LeaveRequest = require("../models/LeaveRequest");
const Attendance = require("../models/Attendance");

const getStartOfDay = require(
  "../utils/getStartOfDay"
);

const getAdminDashboard = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      totalDepartments,
      pendingLeaveRequests,
      presentToday,
      absentToday,
      halfDayToday,
      onLeaveToday,
      recentEmployees,
      recentLeaveRequests,
      departmentDistribution,
      monthlyHiring
    ] = await Promise.all([
      Employee.countDocuments(),

      Employee.countDocuments({
        employmentStatus: "Active"
      }),

      Employee.countDocuments({
        employmentStatus: {
          $ne: "Active"
        }
      }),

      Department.countDocuments(),

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

      Employee.find()
        .populate("user", "name email")
        .populate("department", "name")
        .sort({
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

      Employee.aggregate([
        {
          $group: {
            _id: "$department",
            employeeCount: {
              $sum: 1
            }
          }
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "department"
          }
        },
        {
          $unwind: {
            path: "$department",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 0,
            departmentId: "$_id",
            departmentName: {
              $ifNull: [
                "$department.name",
                "Unassigned"
              ]
            },
            employeeCount: 1
          }
        },
        {
          $sort: {
            employeeCount: -1
          }
        }
      ]),

      Employee.aggregate([
        {
          $match: {
            joiningDate: {
              $ne: null
            }
          }
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$joiningDate"
              },
              month: {
                $month: "$joiningDate"
              }
            },
            employeesJoined: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1
          }
        },
        {
          $limit: 12
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            employeesJoined: 1
          }
        }
      ])
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
        "Admin dashboard fetched successfully",

      summary: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments,
        pendingLeaveRequests,
        presentToday,
        absentToday,
        halfDayToday,
        onLeaveToday,
        unmarkedToday
      },

      charts: {
        departmentDistribution,
        monthlyHiring
      },

      recent: {
        employees: recentEmployees,
        leaveRequests: recentLeaveRequests
      }
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch admin dashboard"
    });
  }
};

module.exports = {
  getAdminDashboard
};