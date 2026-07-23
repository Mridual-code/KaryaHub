const mongoose = require("mongoose");

const LeaveRequest = require(
  "../models/LeaveRequest"
);

const Employee = require(
  "../models/Employee"
);

const User = require(
  "../models/User"
);

const calculateLeaveDays = require(
  "../utils/calculateLeaveDays"
);

const {
  sendEmail,
  sendBulkEmail
} = require(
  "../services/emailService"
);

const {
  leaveSubmittedTemplate,
  leaveStatusTemplate
} = require(
  "../utils/emailTemplates"
);

const {
  createNotification,
  notifyAdmins
} = require(
  "../services/notificationService"
);

const {
  createActivityLog
} = require(
  "../services/activityLogService"
);

const findEmployeeByUser = async (
  userId
) => {
  return Employee.findOne({
    user: userId
  });
};


const applyForLeave = async (
  req,
  res
) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason
    } = req.body;

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason?.trim()
    ) {
      return res.status(400).json({
        message:
          "Leave type, start date, end date and reason are required"
      });
    }

    const employee =
      await findEmployeeByUser(
        req.user._id
      );

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    if (
      employee.employmentStatus !==
      "Active"
    ) {
      return res.status(403).json({
        message:
          "Only active employees can apply for leave"
      });
    }

    const start =
      new Date(startDate);

    const end =
      new Date(endDate);

    if (
      Number.isNaN(
        start.getTime()
      ) ||
      Number.isNaN(
        end.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid leave dates"
      });
    }

    if (end < start) {
      return res.status(400).json({
        message:
          "End date cannot be before start date"
      });
    }

    const totalDays =
      calculateLeaveDays(
        start,
        end
      );

    if (totalDays < 1) {
      return res.status(400).json({
        message:
          "Leave duration must be at least one day"
      });
    }

    const overlappingLeave =
      await LeaveRequest.findOne({
        employee:
          employee._id,

        status: {
          $in: [
            "Pending",
            "Approved"
          ]
        },

        startDate: {
          $lte: end
        },

        endDate: {
          $gte: start
        }
      });

    if (overlappingLeave) {
      return res.status(409).json({
        message:
          "A pending or approved leave request already exists for these dates"
      });
    }

    const leave =
      await LeaveRequest.create({
        employee:
          employee._id,

        leaveType,

        startDate:
          start,

        endDate:
          end,

        totalDays,

        reason:
          reason.trim()
      });

    /*
    |--------------------------------------------------------------------------
    | Notify Admins
    |--------------------------------------------------------------------------
    */

    try {
      await notifyAdmins({
        sender:
          req.user._id,

        title:
          "New Leave Request",

        message:
          `${req.user.name || "An employee"} submitted a ${leave.leaveType} leave request.`,

        type:
          "Leave",

        relatedId:
          leave._id,

        relatedModel:
          "LeaveRequest",

        targetUrl:
          `/admin/leaves/${leave._id}`
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Leave admin notification error:",
        notificationError
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Email Admins
    |--------------------------------------------------------------------------
    */

    try {
      const admins =
        await User.find({
          role: "Admin",
          isActive: true
        }).select("email");

      const adminEmails =
        admins
          .map(
            (admin) =>
              admin.email
          )
          .filter(Boolean);

      if (
        adminEmails.length > 0
      ) {
        await sendBulkEmail({
          recipients:
            adminEmails,

          subject:
            "New Employee Leave Request",

          html:
            leaveSubmittedTemplate({
              employeeName:
                req.user.name ||
                "Employee",

              leaveType:
                leave.leaveType,

              startDate:
                new Date(
                  leave.startDate
                ).toLocaleDateString(),

              endDate:
                new Date(
                  leave.endDate
                ).toLocaleDateString()
            })
        });
      }
    } catch (emailError) {
      console.error(
        "Leave-submission email error:",
        emailError
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Activity Log
    |--------------------------------------------------------------------------
    */

    try {
      await createActivityLog({
        req,

        action:
          "CREATE",

        module:
          "Leave",

        description:
          `Applied for ${leave.leaveType} leave`,

        targetId:
          leave._id,

        targetModel:
          "LeaveRequest",

        metadata: {
          leaveType:
            leave.leaveType,

          startDate:
            leave.startDate,

          endDate:
            leave.endDate,

          totalDays:
            leave.totalDays,

          status:
            leave.status
        }
      });
    } catch (activityError) {
      console.error(
        "Leave activity-log error:",
        activityError
      );
    }

    const populatedLeave =
      await LeaveRequest.findById(
        leave._id
      ).populate({
        path: "employee",

        select:
          "employeeId designation department",

        populate: [
          {
            path:
              "user",

            select:
              "name email"
          },
          {
            path:
              "department",

            select:
              "name"
          }
        ]
      });

    return res.status(201).json({
      message:
        "Leave request submitted successfully",

      leave:
        populatedLeave
    });
  } catch (error) {
    console.error(
      "Apply leave error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationMessage =
        Object.values(
          error.errors
        )
          .map(
            (item) =>
              item.message
          )
          .join(", ");

      return res.status(400).json({
        message:
          validationMessage
      });
    }

    return res.status(500).json({
      message:
        "Failed to submit leave request"
    });
  }
};

const getMyLeaves = async (req, res) => {
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
      status,
      leaveType,
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      employee: employee._id
    };

    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    const [leaves, total] =
      await Promise.all([
        LeaveRequest.find(query)
          .populate(
            "reviewedBy",
            "name email role"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber),

        LeaveRequest.countDocuments(query)
      ]);

    return res.status(200).json({
      leaves,
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
      "Get my leaves error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch leave requests"
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const {
      status,
      leaveType,
      employee,
      department,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    if (
      employee &&
      mongoose.Types.ObjectId.isValid(
        employee
      )
    ) {
      query.employee = employee;
    }

    if (startDate || endDate) {
      query.startDate = {};

      if (startDate) {
        query.startDate.$gte =
          new Date(startDate);
      }

      if (endDate) {
        query.startDate.$lte =
          new Date(endDate);
      }
    }

    let employeeIds = null;

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

      const filteredEmployees =
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

      employeeIds = filteredEmployees.map(
        (item) => item._id
      );

      query.employee = {
        $in: employeeIds
      };
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip =
      (pageNumber - 1) * limitNumber;

    const [leaves, total] =
      await Promise.all([
        LeaveRequest.find(query)
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
            "reviewedBy",
            "name email role"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber),

        LeaveRequest.countDocuments(query)
      ]);

    return res.status(200).json({
      leaves,
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
      "Get all leaves error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch leave requests"
    });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid leave ID"
      });
    }

    const leave =
      await LeaveRequest.findById(id)
        .populate({
          path: "employee",
          populate: [
            {
              path: "user",
              select: "name email role"
            },
            {
              path: "department",
              select: "name"
            },
            {
              path: "manager",
              select:
                "employeeId designation",
              populate: {
                path: "user",
                select: "name email"
              }
            }
          ]
        })
        .populate(
          "reviewedBy",
          "name email role"
        );

    if (!leave) {
      return res.status(404).json({
        message:
          "Leave request not found"
      });
    }

    if (req.user.role === "Employee") {
      const employee =
        await findEmployeeByUser(
          req.user._id
        );

      if (
        !employee ||
        leave.employee._id.toString() !==
          employee._id.toString()
      ) {
        return res.status(403).json({
          message: "Access denied"
        });
      }
    }

    return res.status(200).json({
      leave
    });
  } catch (error) {
    console.error(
      "Get leave by ID error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch leave request"
    });
  }
};

const updateLeaveStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      status,
      reviewComment = ""
    } = req.body;

    if (
      !mongoose.Types.ObjectId
        .isValid(id)
    ) {
      return res.status(400).json({
        message:
          "Invalid leave ID"
      });
    }

    if (
      ![
        "Approved",
        "Rejected"
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Approved or Rejected"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find Leave First
    |--------------------------------------------------------------------------
    */

    const leave =
      await LeaveRequest.findById(id);

    if (!leave) {
      return res.status(404).json({
        message:
          "Leave request not found"
      });
    }

    if (
      leave.status !==
      "Pending"
    ) {
      return res.status(400).json({
        message:
          "Only pending leave requests can be reviewed"
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Leave
    |--------------------------------------------------------------------------
    */

    leave.status = status;
    leave.reviewedBy =
      req.user._id;
    leave.reviewedAt =
      new Date();
    leave.reviewComment =
      reviewComment.trim();

    await leave.save();

    /*
    |--------------------------------------------------------------------------
    | Find Employee and User
    |--------------------------------------------------------------------------
    */

    const employeeRecord =
      await Employee.findById(
        leave.employee
      ).populate(
        "user",
        "name email"
      );

    /*
    |--------------------------------------------------------------------------
    | Employee Notification
    |--------------------------------------------------------------------------
    */

    if (
      employeeRecord
        ?.user?._id
    ) {
      try {
        await createNotification({
          recipient:
            employeeRecord
              .user._id,

          sender:
            req.user._id,

          title:
            status ===
            "Approved"
              ? "Leave Approved"
              : "Leave Rejected",

          message:
            status ===
            "Approved"
              ? `Your ${leave.leaveType} leave request has been approved.`
              : `Your ${leave.leaveType} leave request has been rejected.${
                  reviewComment
                    ? ` Reason: ${reviewComment.trim()}`
                    : ""
                }`,

          type:
            "Leave",

          relatedId:
            leave._id,

          relatedModel:
            "LeaveRequest",

          targetUrl:
            `/employee/leaves/${leave._id}`
        });
      } catch (
        notificationError
      ) {
        console.error(
          "Leave status notification error:",
          notificationError
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Employee Email
    |--------------------------------------------------------------------------
    */

    if (
      employeeRecord
        ?.user?.email
    ) {
      try {
        await sendEmail({
          to:
            employeeRecord
              .user.email,

          subject:
            `Leave Request ${status}`,

          html:
            leaveStatusTemplate({
              employeeName:
                employeeRecord
                  .user.name,

              leaveType:
                leave.leaveType,

              status,

              reviewComment:
                reviewComment.trim()
            })
        });
      } catch (emailError) {
        console.error(
          "Leave-status email error:",
          emailError
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Activity Log
    |--------------------------------------------------------------------------
    */

    try {
      await createActivityLog({
        req,

        action:
          status ===
          "Approved"
            ? "APPROVE"
            : "REJECT",

        module:
          "Leave",

        description:
          `${status} leave request`,

        targetId:
          leave._id,

        targetModel:
          "LeaveRequest",

        metadata: {
          leaveType:
            leave.leaveType,

          employee:
            leave.employee,

          reviewComment:
            reviewComment.trim(),

          status
        }
      });
    } catch (activityError) {
      console.error(
        "Leave review activity-log error:",
        activityError
      );
    }

    const updatedLeave =
      await LeaveRequest.findById(
        id
      )
        .populate({
          path:
            "employee",

          populate: [
            {
              path:
                "user",

              select:
                "name email"
            },
            {
              path:
                "department",

              select:
                "name"
            }
          ]
        })
        .populate(
          "reviewedBy",
          "name email role"
        );

    return res.status(200).json({
      message:
        `Leave request ${status.toLowerCase()} successfully`,

      leave:
        updatedLeave
    });
  } catch (error) {
    console.error(
      "Update leave status error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update leave status"
    });
  }
};

const cancelLeave = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId
        .isValid(id)
    ) {
      return res.status(400).json({
        message:
          "Invalid leave ID"
      });
    }

    const employee =
      await findEmployeeByUser(
        req.user._id
      );

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    const leave =
      await LeaveRequest.findOne({
        _id: id,
        employee:
          employee._id
      });

    if (!leave) {
      return res.status(404).json({
        message:
          "Leave request not found"
      });
    }

    if (
      leave.status !==
      "Pending"
    ) {
      return res.status(400).json({
        message:
          "Only pending leave requests can be cancelled"
      });
    }

    leave.status =
      "Cancelled";

    leave.cancelledAt =
      new Date();

    await leave.save();

    /*
    |--------------------------------------------------------------------------
    | Notify Admins
    |--------------------------------------------------------------------------
    */

    try {
      await notifyAdmins({
        sender:
          req.user._id,

        title:
          "Leave Request Cancelled",

        message:
          `${req.user.name || "An employee"} cancelled a ${leave.leaveType} leave request.`,

        type:
          "Leave",

        relatedId:
          leave._id,

        relatedModel:
          "LeaveRequest",

        targetUrl:
          `/admin/leaves/${leave._id}`
      });
    } catch (
      notificationError
    ) {
      console.error(
        "Leave cancellation notification error:",
        notificationError
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Activity Log
    |--------------------------------------------------------------------------
    */

    try {
      await createActivityLog({
        req,

        action:
          "CANCEL",

        module:
          "Leave",

        description:
          "Cancelled leave request",

        targetId:
          leave._id,

        targetModel:
          "LeaveRequest",

        metadata: {
          leaveType:
            leave.leaveType,

          startDate:
            leave.startDate,

          endDate:
            leave.endDate,

          totalDays:
            leave.totalDays
        }
      });
    } catch (activityError) {
      console.error(
        "Leave cancellation activity-log error:",
        activityError
      );
    }

    return res.status(200).json({
      message:
        "Leave request cancelled successfully",

      leave
    });
  } catch (error) {
    console.error(
      "Cancel leave error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to cancel leave request"
    });
  }
};

const getLeaveStats = async (
  req,
  res
) => {
  try {
    const statistics =
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

    const byType =
      await LeaveRequest.aggregate([
        {
          $group: {
            _id: "$leaveType",
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ]);

    const summary = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    };

    statistics.forEach((item) => {
      summary.total += item.count;

      const key =
        item._id.toLowerCase();

      summary[key] = item.count;
    });

    return res.status(200).json({
      stats: summary,
      leaveTypes: byType
    });
  } catch (error) {
    console.error(
      "Leave stats error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch leave statistics"
    });
  }
};

module.exports = {
  applyForLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
  cancelLeave,
  getLeaveStats
};