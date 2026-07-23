const mongoose = require(
  "mongoose"
);

const Employee = require(
  "../models/Employee"
);

const Attendance = require(
  "../models/Attendance"
);

const buildCalendarResponse = (
  records
) => {
  const calendar = {};

  records.forEach((record) => {
    const dateKey =
      new Date(record.date)
        .toISOString()
        .split("T")[0];

    calendar[dateKey] = {
      id: record._id,
      status: record.status,
      checkIn:
        record.checkIn || null,
      checkOut:
        record.checkOut || null,
      workingMinutes:
        record.workingMinutes || 0
    };
  });

  return calendar;
};

const getMyAttendanceCalendar =
  async (req, res) => {
    try {
      const currentDate =
        new Date();

      const month =
        Number(req.query.month) ||
        currentDate.getMonth() + 1;

      const year =
        Number(req.query.year) ||
        currentDate.getFullYear();

      if (
        month < 1 ||
        month > 12
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Month must be between 1 and 12"
        });
      }

      const employee =
        await Employee.findOne({
          user: req.user._id
        });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee profile not found"
        });
      }

      const startDate =
        new Date(
          year,
          month - 1,
          1
        );

      const endDate =
        new Date(
          year,
          month,
          0,
          23,
          59,
          59,
          999
        );

      const records =
        await Attendance.find({
          employee: employee._id,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }).sort({ date: 1 });

      res.status(200).json({
        success: true,
        month,
        year,
        employeeId:
          employee.employeeId,
        calendar:
          buildCalendarResponse(
            records
          ),
        records
      });
    } catch (error) {
      console.error(
        "My attendance calendar error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load attendance calendar"
      });
    }
  };

const getEmployeeAttendanceCalendar =
  async (req, res) => {
    try {
      const {
        employeeId
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          employeeId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee ID"
        });
      }

      const currentDate =
        new Date();

      const month =
        Number(req.query.month) ||
        currentDate.getMonth() + 1;

      const year =
        Number(req.query.year) ||
        currentDate.getFullYear();

      if (
        month < 1 ||
        month > 12
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Month must be between 1 and 12"
        });
      }

      const employee =
        await Employee.findById(
          employeeId
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "department",
            "name"
          );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message:
            "Employee not found"
        });
      }

      const startDate =
        new Date(
          year,
          month - 1,
          1
        );

      const endDate =
        new Date(
          year,
          month,
          0,
          23,
          59,
          59,
          999
        );

      const records =
        await Attendance.find({
          employee: employee._id,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }).sort({ date: 1 });

      res.status(200).json({
        success: true,
        month,
        year,

        employee: {
          id: employee._id,
          employeeId:
            employee.employeeId,
          name:
            employee.user?.name,
          department:
            employee.department?.name
        },

        calendar:
          buildCalendarResponse(
            records
          ),

        records
      });
    } catch (error) {
      console.error(
        "Employee attendance calendar error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load employee attendance calendar"
      });
    }
  };

module.exports = {
  getMyAttendanceCalendar,
  getEmployeeAttendanceCalendar
};