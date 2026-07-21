const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    leaveType: {
      type: String,
      enum: [
        "Casual Leave",
        "Sick Leave",
        "Earned Leave",
        "Maternity Leave",
        "Paternity Leave",
        "Unpaid Leave",
        "Other"
      ],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Cancelled"
      ],
      default: "Pending"
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    reviewedAt: {
      type: Date,
      default: null
    },

    reviewComment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },

    cancelledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

leaveRequestSchema.index({
  employee: 1,
  startDate: 1,
  endDate: 1
});

leaveRequestSchema.index({
  status: 1
});

module.exports = mongoose.model(
  "LeaveRequest",
  leaveRequestSchema
);