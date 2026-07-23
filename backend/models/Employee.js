const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    employmentType: {
      type: String,
      enum: [
        "Full-Time",
        "Part-Time",
        "Intern",
        "Contract"
      ],
      default: "Full-Time"
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^[0-9+\-\s]{7,15}$/,
        "Please provide a valid phone number"
      ]
    },

    dateOfBirth: {
      type: Date,
      default: null
    },

    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Other",
        "Prefer Not to Say"
      ],
      default: "Prefer Not to Say"
    },

    address: {
      street: {
        type: String,
        trim: true,
        default: ""
      },

      city: {
        type: String,
        trim: true,
        default: ""
      },

      state: {
        type: String,
        trim: true,
        default: ""
      },

      country: {
        type: String,
        trim: true,
        default: "India"
      },

      postalCode: {
        type: String,
        trim: true,
        default: ""
      }
    },

    emergencyContact: {
      name: {
        type: String,
        trim: true,
        default: ""
      },

      relationship: {
        type: String,
        trim: true,
        default: ""
      },

      phone: {
        type: String,
        trim: true,
        default: ""
      }
    },

    joiningDate: {
      type: Date,
      required: true
    },

    salary: {
      type: Number,
      min: [0, "Salary cannot be negative"],
      default: 0
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null
    },

    profileImage: {
      type: String,
      trim: true,
      default: ""
    },

    profilePicture: {
      type: String,
      trim: true,
      default: ""
    },

    employmentStatus: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Resigned",
        "Terminated"
      ],
      default: "Active"
    },

    leavingDate: {
      type: Date,
      default: null
    },

    deactivationReason: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

employeeSchema.index({
  employeeId: 1,
  department: 1,
  employmentStatus: 1
});

module.exports = mongoose.model(
  "Employee",
  employeeSchema
);