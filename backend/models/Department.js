const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    departmentHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Department",
  departmentSchema
);