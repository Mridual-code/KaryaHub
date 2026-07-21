const mongoose = require("mongoose");

const Attendance = require(
  "../models/Attendance"
);
const Employee = require("../models/Employee");
const LeaveRequest = require(
  "../models/LeaveRequest"
);

const getStartOfDay = require(
  "../utils/getStartOfDay"
);
const calculateWorkingHours = require(
  "../utils/calculateWorkingHours"
);
const {
  createActivityLog
} = require(
  "../services/activityLogService"
);
const findEmployeeByUser = async (userId) => {
  return Employee.findOne({
    user: userId
  });
};

const checkIn = async (req, res) => {
  try {
    const employee =
      await findEmployeeByUser(req.user._id);

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    if (
      employee.employmentStatus !== "Active"
    ) {
      return res.status(403).json({
        message:
          "Inactive employees cannot check in"
      });
    }

    const now = new Date();
    const today = getStartOfDay(now);

    const approvedLeave =
      await LeaveRequest.findOne({
        employee: employee._id,
        status: "Approved",
        startDate: {
          $lte: today
        },
        endDate: {
          $gte: today
        }
      });

    if (approvedLeave) {
      return res.status(400).json({
        message:
          "You cannot check in while you are on approved leave"
      });
    }

    let attendance =
      await Attendance.findOne({
        employee: employee._id,
        date: today
      });

    if (attendance?.checkIn) {
      return res.status(409).json({
        message:
          "You have already checked in today",
        attendance
      });
    }

    if (!attendance) {
      attendance =
        await Attendance.create({
          employee: employee._id,
          date: today,
          checkIn: now,
          status: "Present"
        });
    } else {
      attendance.checkIn = now;
      attendance.status = "Present";

      await attendance.save();
    }
    await createActivityLog({
  req,
  action: "CHECK_IN",
  module: "Attendance",
  description: "Employee checked in",
  targetId: attendance._id,
  targetModel: "Attendance",
  metadata: {
    employeeId: employee.employeeId,
    date: attendance.date,
    checkIn: attendance.checkIn,
    status: attendance.status
  }
});

    return res.status(200).json({
      message:
        "Checked in successfully",
      attendance
    });
  } catch (error) {
    console.error(
      "Check-in error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Attendance already exists for today"
      });
    }

    return res.status(500).json({
      message: "Failed to check in"
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const employee =
      await findEmployeeByUser(req.user._id);

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    const now = new Date();
    const today = getStartOfDay(now);

    const attendance =
      await Attendance.findOne({
        employee: employee._id,
        date: today
      });

    if (!attendance) {
      return res.status(404).json({
        message:
          "No check-in record found for today"
      });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({
        message:
          "You must check in before checking out"
      });
    }

    if (attendance.checkOut) {
      return res.status(409).json({
        message:
          "You have already checked out today",
        attendance
      });
    }

    attendance.checkOut = now;

    attendance.workingHours =
  calculateWorkingHours(
    attendance.checkIn,
    now
  );

if (attendance.workingHours < 4) {
  attendance.status = "Half Day";
} else {
  attendance.status = "Present";
}
    await attendance.save();
await createActivityLog({
  req,
  action: "CHECK_OUT",
  module: "Attendance",
  description: "Employee checked out",
  targetId: attendance._id,
  targetModel: "Attendance",
  metadata: {
    employeeId: employee.employeeId,
    date: attendance.date,
    checkIn: attendance.checkIn,
    checkOut: attendance.checkOut,
    workingHours:
      attendance.workingHours,
    status: attendance.status
  }
});
    return res.status(200).json({
      message:
        "Checked out successfully",
      attendance
    });
  } catch (error) {
    console.error(
      "Check-out error:",
      error
    );

    return res.status(500).json({
      message: "Failed to check out"
    });
  }
};

const getMyAttendance = async (
  req,
  res
) => {
  try {
    const employee =
      await findEmployeeByUser(req.user._id);

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    const {
      startDate,
      endDate,
      status,
      page = 1,
      limit = 31
    } = req.query;

    const query = {
      employee: employee._id
    };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte =
          getStartOfDay(startDate);
      }

      if (endDate) {
        const end =
          getStartOfDay(endDate);

        end.setHours(23, 59, 59, 999);

        query.date.$lte = end;
      }
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 31, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    const [records, total] =
      await Promise.all([
        Attendance.find(query)
          .sort({ date: -1 })
          .skip(skip)
          .limit(limitNumber),

        Attendance.countDocuments(query)
      ]);

    return res.status(200).json({
      attendance: records,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(
          total / limitNumber
        )
      }
    });
  } catch (error) {
    console.error(
      "Get my attendance error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance"
    });
  }
};

const getTodayAttendance = async (
  req,
  res
) => {
  try {
    const employee =
      await findEmployeeByUser(req.user._id);

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    const today =
      getStartOfDay(new Date());

    const attendance =
      await Attendance.findOne({
        employee: employee._id,
        date: today
      });

    return res.status(200).json({
      attendance: attendance || null
    });
  } catch (error) {
    console.error(
      "Get today attendance error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch today's attendance"
    });
  }
};

const getAllAttendance = async (
  req,
  res
) => {
  try {
    const {
      employee,
      department,
      status,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (
      employee &&
      mongoose.Types.ObjectId.isValid(
        employee
      )
    ) {
      query.employee = employee;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte =
          getStartOfDay(startDate);
      }

      if (endDate) {
        const finalDate =
          getStartOfDay(endDate);

        finalDate.setHours(
          23,
          59,
          59,
          999
        );

        query.date.$lte = finalDate;
      }
    }

    if (department || search) {
      const employeeQuery = {};

      if (
        department &&
        mongoose.Types.ObjectId.isValid(
          department
        )
      ) {
        employeeQuery.department =
          department;
      }

      const employees =
        await Employee.find(employeeQuery)
          .populate("user", "name email");

      const matchingEmployees =
        search
          ? employees.filter((item) => {
              const value =
                search.toLowerCase();

              return (
                item.employeeId
                  ?.toLowerCase()
                  .includes(value) ||
                item.designation
                  ?.toLowerCase()
                  .includes(value) ||
                item.user?.name
                  ?.toLowerCase()
                  .includes(value) ||
                item.user?.email
                  ?.toLowerCase()
                  .includes(value)
              );
            })
          : employees;

      query.employee = {
        $in: matchingEmployees.map(
          (item) => item._id
        )
      };
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    const [records, total] =
      await Promise.all([
        Attendance.find(query)
          .populate({
            path: "employee",
            select:
              "employeeId designation department employmentStatus",
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
          .populate(
            "markedBy",
            "name email role"
          )
          .sort({
            date: -1,
            createdAt: -1
          })
          .skip(skip)
          .limit(limitNumber),

        Attendance.countDocuments(query)
      ]);

    return res.status(200).json({
      attendance: records,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(
          total / limitNumber
        )
      }
    });
  } catch (error) {
    console.error(
      "Get all attendance error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance"
    });
  }
};

const markAttendance = async (
  req,
  res
) => {
  try {
    const {
      employeeId,
      date,
      status,
      checkIn,
      checkOut,
      notes = ""
    } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        message:
          "Employee, date and status are required"
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        employeeId
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid employee ID"
      });
    }

    const employee =
      await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee not found"
      });
    }

    const attendanceDate =
      getStartOfDay(date);

    let parsedCheckIn = null;
    let parsedCheckOut = null;

    if (checkIn) {
      parsedCheckIn = new Date(checkIn);
    }

    if (checkOut) {
      parsedCheckOut = new Date(checkOut);
    }

    if (
      parsedCheckIn &&
      Number.isNaN(
        parsedCheckIn.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid check-in time"
      });
    }

    if (
      parsedCheckOut &&
      Number.isNaN(
        parsedCheckOut.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid check-out time"
      });
    }

    if (
      parsedCheckIn &&
      parsedCheckOut &&
      parsedCheckOut <= parsedCheckIn
    ) {
      return res.status(400).json({
        message:
          "Check-out must be after check-in"
      });
    }

    const workingMinutes =
      calculateWorkingMinutes(
        parsedCheckIn,
        parsedCheckOut
      );

    const attendance =
      await Attendance.findOneAndUpdate(
        {
          employee: employeeId,
          date: attendanceDate
        },
        {
          employee: employeeId,
          date: attendanceDate,
          status,
          checkIn: parsedCheckIn,
          checkOut: parsedCheckOut,
          workingMinutes,
          notes,
          markedBy: req.user._id
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).populate({
        path: "employee",
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
      });

    await createActivityLog({
      req,
      action: "MARK_ATTENDANCE",
      module: "Attendance",
      description: `Marked attendance for ${attendance.employee.user.name}`,
      targetId: attendance._id,
      targetModel: "Attendance",
      metadata: {
        employee: attendance.employee._id,
        employeeId:
          attendance.employee.employeeId,
        date: attendance.date,
        status: attendance.status,
        checkIn:
          attendance.checkIn,
        checkOut:
          attendance.checkOut,
        workingMinutes:
          attendance.workingMinutes,
        markedBy: req.user._id
      }
    });

    return res.status(200).json({
      message:
        "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    console.error(
      "Mark attendance error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to mark attendance"
    });
  }
};
const updateAttendance = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message:
          "Invalid attendance ID"
      });
    }

    const attendance =
      await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        message:
          "Attendance record not found"
      });
    }

    const previousData = {
      status: attendance.status,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      workingMinutes:
        attendance.workingMinutes,
      notes: attendance.notes
    };

    const {
      status,
      checkIn,
      checkOut,
      notes
    } = req.body;

    if (status !== undefined) {
      attendance.status = status;
    }

    if (checkIn !== undefined) {
      attendance.checkIn = checkIn
        ? new Date(checkIn)
        : null;
    }

    if (checkOut !== undefined) {
      attendance.checkOut = checkOut
        ? new Date(checkOut)
        : null;
    }

    if (
      attendance.checkIn &&
      Number.isNaN(
        attendance.checkIn.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid check-in time"
      });
    }

    if (
      attendance.checkOut &&
      Number.isNaN(
        attendance.checkOut.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid check-out time"
      });
    }

    if (
      attendance.checkIn &&
      attendance.checkOut &&
      attendance.checkOut <=
        attendance.checkIn
    ) {
      return res.status(400).json({
        message:
          "Check-out must be after check-in"
      });
    }

    if (notes !== undefined) {
      attendance.notes = notes;
    }

    attendance.workingMinutes =
      calculateWorkingMinutes(
        attendance.checkIn,
        attendance.checkOut
      );

    attendance.markedBy =
      req.user._id;

    await attendance.save();

    await createActivityLog({
      req,
      action:
        "UPDATE_ATTENDANCE",
      module: "Attendance",
      description:
        "Updated attendance record",
      targetId:
        attendance._id,
      targetModel:
        "Attendance",
      metadata: {
        employee:
          attendance.employee,
        date:
          attendance.date,
        previousData,
        updatedData: {
          status:
            attendance.status,
          checkIn:
            attendance.checkIn,
          checkOut:
            attendance.checkOut,
          workingMinutes:
            attendance.workingMinutes,
          notes:
            attendance.notes
        },
        markedBy:
          req.user._id
      }
    });

    const updatedAttendance =
      await Attendance.findById(id)
        .populate({
          path: "employee",
          populate: [
            {
              path: "user",
              select:
                "name email"
            },
            {
              path:
                "department",
              select: "name"
            }
          ]
        })
        .populate(
          "markedBy",
          "name email role"
        );

    return res.status(200).json({
      message:
        "Attendance updated successfully",
      attendance:
        updatedAttendance
    });
  } catch (error) {
    console.error(
      "Update attendance error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update attendance"
    });
  }
};

const getAttendanceStats = async (
  req,
  res
) => {
  try {
    const requestedDate =
      req.query.date || new Date();

    const day =
      getStartOfDay(requestedDate);

    const nextDay = new Date(day);

    nextDay.setDate(
      nextDay.getDate() + 1
    );

    const totalActiveEmployees =
      await Employee.countDocuments({
        employmentStatus: "Active"
      });

    const records =
      await Attendance.aggregate([
        {
          $match: {
            date: {
              $gte: day,
              $lt: nextDay
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

    const stats = {
      totalActiveEmployees,
      present: 0,
      absent: 0,
      halfDay: 0,
      onLeave: 0,
      holiday: 0,
      unmarked: totalActiveEmployees
    };

    records.forEach((item) => {
      if (item._id === "Present") {
        stats.present = item.count;
      }

      if (item._id === "Absent") {
        stats.absent = item.count;
      }

      if (item._id === "Half Day") {
        stats.halfDay = item.count;
      }

      if (item._id === "On Leave") {
        stats.onLeave = item.count;
      }

      if (item._id === "Holiday") {
        stats.holiday = item.count;
      }

      stats.unmarked -= item.count;
    });

    stats.unmarked = Math.max(
      stats.unmarked,
      0
    );

    return res.status(200).json({
      date: day,
      stats
    });
  } catch (error) {
    console.error(
      "Attendance stats error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch attendance statistics"
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayAttendance,
  getAllAttendance,
  markAttendance,
  updateAttendance,
  getAttendanceStats
};