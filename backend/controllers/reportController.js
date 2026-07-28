const Employee = require(
  "../models/Employee"
);

const Attendance = require(
  "../models/Attendance"
);

const LeaveRequest = require(
  "../models/LeaveRequest"
);

const {
  generateCsv
} = require("../utils/csvExporter");

const sendCsvResponse = (
  res,
  filename,
  csvContent
) => {
  res.setHeader(
    "Content-Type",
    "text/csv; charset=utf-8"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  res.status(200).send(
    `\uFEFF${csvContent}`
  );
};

const exportEmployeesCsv = async (
  req,
  res
) => {
  try {
    const {
      department,
      employmentStatus,
      employmentType,
      search
    } = req.query;

    const filter = {};

    if (department) {
      filter.department = department;
    }

    if (employmentStatus) {
      filter.employmentStatus =
        employmentStatus;
    }

    if (employmentType) {
      filter.employmentType =
        employmentType;
    }

    const employees =
      await Employee.find(filter)
        .populate(
          "user",
          "name email role"
        )
        .populate(
          "department",
          "name"
        )
        .sort({ createdAt: -1 });

    let filteredEmployees =
      employees;

    if (search) {
      const searchValue =
        search.toLowerCase();

      filteredEmployees =
        employees.filter(
          (employee) =>
            employee.employeeId
              ?.toLowerCase()
              .includes(searchValue) ||
            employee.user?.name
              ?.toLowerCase()
              .includes(searchValue) ||
            employee.user?.email
              ?.toLowerCase()
              .includes(searchValue) ||
            employee.designation
              ?.toLowerCase()
              .includes(searchValue)
        );
    }

    const rows =
      filteredEmployees.map(
        (employee) => ({
          employeeId:
            employee.employeeId,
          name:
            employee.user?.name || "",
          email:
            employee.user?.email || "",
          department:
            employee.department?.name ||
            "",
          designation:
            employee.designation || "",
          employmentType:
            employee.employmentType ||
            "",
          employmentStatus:
            employee.employmentStatus ||
            "",
          joiningDate:
            employee.joiningDate
              ? new Date(
                  employee.joiningDate
                ).toLocaleDateString()
              : "",
          createdAt:
            employee.createdAt
              ? new Date(
                  employee.createdAt
                ).toLocaleString()
              : ""
        })
      );

    const csv = generateCsv({
      headers: [
        {
          key: "employeeId",
          label: "Employee ID"
        },
        {
          key: "name",
          label: "Name"
        },
        {
          key: "email",
          label: "Email"
        },
        {
          key: "department",
          label: "Department"
        },
        {
          key: "designation",
          label: "Designation"
        },
        {
          key: "employmentType",
          label: "Employment Type"
        },
        {
          key: "employmentStatus",
          label: "Employment Status"
        },
        {
          key: "joiningDate",
          label: "Joining Date"
        },
        {
          key: "createdAt",
          label: "Created At"
        }
      ],
      rows
    });

    sendCsvResponse(
      res,
      "employees-report.csv",
      csv
    );
  } catch (error) {
    console.error(
      "Export employees error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to export employees"
    });
  }
};

const exportAttendanceCsv = async (
  req,
  res
) => {
  try {
    const {
      employeeId,
      status,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (employeeId) {
      filter.employee = employeeId;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte =
          new Date(startDate);
      }

      if (endDate) {
        const end =
          new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        filter.date.$lte = end;
      }
    }

    const records =
      await Attendance.find(filter)
        .populate({
          path: "employee",
          select:
            "employeeId designation user department",
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
        .sort({ date: -1 });

    const rows = records.map(
      (record) => ({
        employeeId:
          record.employee
            ?.employeeId || "",
        name:
          record.employee
            ?.user?.name || "",
        department:
          record.employee
            ?.department?.name || "",
        date: record.date
          ? new Date(
              record.date
            ).toLocaleDateString()
          : "",
        status:
          record.status || "",
        checkIn: record.checkIn
          ? new Date(
              record.checkIn
            ).toLocaleTimeString()
          : "",
        checkOut: record.checkOut
          ? new Date(
              record.checkOut
            ).toLocaleTimeString()
          : "",
        workingMinutes:
          record.workingMinutes || 0
      })
    );

    const csv = generateCsv({
      headers: [
        {
          key: "employeeId",
          label: "Employee ID"
        },
        {
          key: "name",
          label: "Employee Name"
        },
        {
          key: "department",
          label: "Department"
        },
        {
          key: "date",
          label: "Date"
        },
        {
          key: "status",
          label: "Status"
        },
        {
          key: "checkIn",
          label: "Check In"
        },
        {
          key: "checkOut",
          label: "Check Out"
        },
        {
          key: "workingMinutes",
          label: "Working Minutes"
        }
      ],
      rows
    });

    sendCsvResponse(
      res,
      "attendance-report.csv",
      csv
    );
  } catch (error) {
    console.error(
      "Export attendance error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to export attendance"
    });
  }
};

const exportLeavesCsv = async (
  req,
  res
) => {
  try {
    const {
      employeeId,
      status,
      leaveType,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (employeeId) {
      filter.employee = employeeId;
    }

    if (status) {
      filter.status = status;
    }

    if (leaveType) {
      filter.leaveType = leaveType;
    }

    if (startDate || endDate) {
      filter.startDate = {};

      if (startDate) {
        filter.startDate.$gte =
          new Date(startDate);
      }

      if (endDate) {
        const end =
          new Date(endDate);

        end.setHours(
          23,
          59,
          59,
          999
        );

        filter.startDate.$lte = end;
      }
    }

    const leaves =
      await LeaveRequest.find(
        filter
      )
        .populate({
          path: "employee",
          select:
            "employeeId user department",
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
        .sort({ createdAt: -1 });

    const rows = leaves.map(
      (leave) => ({
        employeeId:
          leave.employee
            ?.employeeId || "",
        name:
          leave.employee
            ?.user?.name || "",
        department:
          leave.employee
            ?.department?.name || "",
        leaveType:
          leave.leaveType || "",
        startDate:
          leave.startDate
            ? new Date(
                leave.startDate
              ).toLocaleDateString()
            : "",
        endDate:
          leave.endDate
            ? new Date(
                leave.endDate
              ).toLocaleDateString()
            : "",
        totalDays:
          leave.totalDays || 0,
        status:
          leave.status || "",
        reason:
          leave.reason || "",
        reviewComment:
          leave.reviewComment || ""
      })
    );

    const csv = generateCsv({
      headers: [
        {
          key: "employeeId",
          label: "Employee ID"
        },
        {
          key: "name",
          label: "Employee Name"
        },
        {
          key: "department",
          label: "Department"
        },
        {
          key: "leaveType",
          label: "Leave Type"
        },
        {
          key: "startDate",
          label: "Start Date"
        },
        {
          key: "endDate",
          label: "End Date"
        },
        {
          key: "totalDays",
          label: "Total Days"
        },
        {
          key: "status",
          label: "Status"
        },
        {
          key: "reason",
          label: "Reason"
        },
        {
          key: "reviewComment",
          label: "Review Comment"
        }
      ],
      rows
    });

    sendCsvResponse(
      res,
      "leave-report.csv",
      csv
    );
  } catch (error) {
    console.error(
      "Export leaves error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to export leave report"
    });
  }
};
const getEmployeeReports = async(req,res)=>{
    try {

        const employees =
            await Employee.find()
            .populate("user","name email role")
            .populate("department","name")
            .sort({
                createdAt:-1
            });


        res.json({
            success:true,
            data:employees
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:"Failed to fetch employee reports"
        });

    }
};

module.exports = {
  exportEmployeesCsv,
  exportAttendanceCsv,
  exportLeavesCsv
};