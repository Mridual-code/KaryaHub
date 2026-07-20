const Employee = require("../models/Employee");

const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne({
    employeeId: /^KH-EMP-\d+$/
  })
    .sort({ employeeId: -1 })
    .select("employeeId")
    .lean();

  let nextNumber = 1;

  if (lastEmployee?.employeeId) {
    const lastNumber = Number(
      lastEmployee.employeeId.replace(
        "KH-EMP-",
        ""
      )
    );

    if (!Number.isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `KH-EMP-${String(nextNumber).padStart(
    4,
    "0"
  )}`;
};

module.exports = generateEmployeeId;