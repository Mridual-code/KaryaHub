const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
      },

      type: {
        type: String,
        enum: [
          "Leave",
          "Attendance",
          "Employee",
          "Department",
          "Authentication",
          "System",
          "General"
        ],
        default: "General"
      },

      relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },

      relatedModel: {
        type: String,
        enum: [
          "LeaveRequest",
          "Attendance",
          "Employee",
          "Department",
          "User",
          null
        ],
        default: null
      },

      targetUrl: {
        type: String,
        default: ""
      },

      isRead: {
        type: Boolean,
        default: false
      },

      readAt: {
        type: Date,
        default: null
      }
    },
    {
      timestamps: true
    }
  );

notificationSchema.index({
  recipient: 1,
  createdAt: -1
});

notificationSchema.index({
  recipient: 1,
  isRead: 1
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);