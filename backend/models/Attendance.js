const mongoose = require("mongoose");

const attendanceSchema =
  new mongoose.Schema(
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
      },

      date: {
        type: Date,
        required: true
      },

      checkIn: {
        type: Date,
        default: null
      },

      checkOut: {
        type: Date,
        default: null
      },

      workingHours: {
        type: Number,
        default: 0,
        min: 0
      },

      status: {
        type: String,
        enum: [
          "Present",
          "Absent",
          "Half Day",
          "On Leave",
          "Holiday"
        ],
        default: "Present"
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
      },

      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      }
    },
    {
      timestamps: true
    }
  );

attendanceSchema.index(
  {
    employee: 1,
    date: 1
  },
  {
    unique: true
  }
);

attendanceSchema.index({
  date: 1,
  status: 1
});

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);