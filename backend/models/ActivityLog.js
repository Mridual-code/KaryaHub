const mongoose = require("mongoose");

const activityLogSchema =
  new mongoose.Schema(
    {
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
      },

      action: {
        type: String,
        required: true,
        trim: true,
        enum: [
          "CREATE",
          "UPDATE",
          "DELETE",
          "ACTIVATE",
          "DEACTIVATE",
          "APPROVE",
          "REJECT",
          "CANCEL",
          "CHECK_IN",
          "CHECK_OUT",
          "LOGIN",
          "LOGOUT",
          "MARK_ATTENDANCE",
          "UPDATE_ATTENDANCE",
          "OTHER"
        ],
        index: true
      },

      module: {
        type: String,
        required: true,
        trim: true,
        enum: [
          "Authentication",
          "Employee",
          "Department",
          "Leave",
          "Attendance",
          "Profile",
          "Dashboard",
          "System"
        ],
        index: true
      },

      description: {
        type: String,
        required: true,
        trim: true
      },

      targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },

      targetModel: {
        type: String,
        enum: [
          "User",
          "Employee",
          "Department",
          "LeaveRequest",
          "Attendance",
          null
        ],
        default: null
      },

      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },

      ipAddress: {
        type: String,
        default: ""
      },

      userAgent: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true
    }
  );

activityLogSchema.index({
  createdAt: -1
});

activityLogSchema.index({
  module: 1,
  action: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "ActivityLog",
  activityLogSchema
);