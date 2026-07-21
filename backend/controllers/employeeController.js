const mongoose = require("mongoose");

const User = require("../models/User");
const Employee = require("../models/Employee");
const Department = require(
  "../models/Department"
);

const generateEmployeeId = require(
  "../utils/generateEmployeeId"
);
const {
  createActivityLog
} = require(
  "../services/activityLogService"
);
const employeePopulate = [
  {
    path: "user",
    select:
      "name email role isActive lastLogin"
  },
  {
    path: "department",
    select:
      "name code description isActive"
  },
  {
    path: "manager",
    select:
      "employeeId designation employmentStatus",
    populate: {
      path: "user",
      select: "name email"
    }
  }
];

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/*
|--------------------------------------------------------------------------
| Create Employee
|--------------------------------------------------------------------------
| Admin creates both:
| 1. User login account
| 2. Employee profile
*/
const createEmployee = async (req, res) => {
  let createdUser = null;

  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      employmentType,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      joiningDate,
      salary,
      manager,
      profileImage
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !department ||
      !designation?.trim() ||
      !joiningDate
    ) {
      return res.status(400).json({
        message:
          "Name, email, password, department, designation and joining date are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters"
      });
    }

    if (!isValidObjectId(department)) {
      return res.status(400).json({
        message: "Invalid department ID"
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "A user with this email already exists"
      });
    }

    const existingDepartment =
      await Department.findById(department);

    if (!existingDepartment) {
      return res.status(404).json({
        message: "Department not found"
      });
    }

    if (!existingDepartment.isActive) {
      return res.status(400).json({
        message:
          "Cannot assign an employee to an inactive department"
      });
    }

    if (manager) {
      if (!isValidObjectId(manager)) {
        return res.status(400).json({
          message: "Invalid manager ID"
        });
      }

      const managerEmployee =
        await Employee.findById(manager);

      if (!managerEmployee) {
        return res.status(404).json({
          message: "Manager not found"
        });
      }

      if (
        managerEmployee.employmentStatus !==
        "Active"
      ) {
        return res.status(400).json({
          message:
            "Only an active employee can be assigned as manager"
        });
      }
    }

    const parsedJoiningDate = new Date(
      joiningDate
    );

    if (
      Number.isNaN(
        parsedJoiningDate.getTime()
      )
    ) {
      return res.status(400).json({
        message: "Invalid joining date"
      });
    }

    if (
      salary !== undefined &&
      Number(salary) < 0
    ) {
      return res.status(400).json({
        message: "Salary cannot be negative"
      });
    }

    /*
      User.js already hashes passwords through
      pre("save"), so do not hash the password here.
    */
    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "Employee",
      isActive: true
    });

    const employeeId =
      await generateEmployeeId();

    const employee = await Employee.create({
      user: createdUser._id,
      employeeId,
      department,
      designation: designation.trim(),
      employmentType:
        employmentType || "Full-Time",
      phone: phone?.trim() || "",
      dateOfBirth: dateOfBirth || null,
      gender: gender || "Prefer Not to Say",

      address: {
        street:
          address?.street?.trim() || "",
        city:
          address?.city?.trim() || "",
        state:
          address?.state?.trim() || "",
        country:
          address?.country?.trim() ||
          "India",
        postalCode:
          address?.postalCode?.trim() ||
          ""
      },

      emergencyContact: {
        name:
          emergencyContact?.name?.trim() ||
          "",
        relationship:
          emergencyContact?.relationship?.trim() ||
          "",
        phone:
          emergencyContact?.phone?.trim() ||
          ""
      },

      joiningDate: parsedJoiningDate,
      salary: Number(salary) || 0,
      manager: manager || null,
      profileImage:
        profileImage?.trim() || "",
      employmentStatus: "Active"
    });

    const populatedEmployee =
  await Employee.findById(employee._id)
    .populate(employeePopulate);

/*
|--------------------------------------------------------------------------
| Activity Log
|--------------------------------------------------------------------------
*/

await createActivityLog({
  req,
  action: "CREATE",
  module: "Employee",
  description: `Created employee ${createdUser.name} (${employee.employeeId})`,
  targetId: employee._id,
  targetModel: "Employee",
  metadata: {
    employeeId: employee.employeeId,
    department:
      existingDepartment.name,
    designation:
      employee.designation,
    employmentType:
      employee.employmentType
  }
});

return res.status(201).json({
  message:
    "Employee created successfully",
  employee: populatedEmployee
});
  } catch (error) {
    /*
      If user creation succeeded but employee
      creation failed, remove that incomplete user.
    */
    if (createdUser?._id) {
      await User.findByIdAndDelete(
        createdUser._id
      ).catch(() => {});
    }

    console.error(
      "Create employee error:",
      error
    );

    if (error.code === 11000) {
      const duplicateField =
        Object.keys(
          error.keyPattern || {}
        )[0] || "field";

      return res.status(409).json({
        message: `An employee with this ${duplicateField} already exists`
      });
    }

    if (error.name === "ValidationError") {
      const validationMessage =
        Object.values(error.errors)
          .map((item) => item.message)
          .join(", ");

      return res.status(400).json({
        message: validationMessage
      });
    }

    return res.status(500).json({
      message:
        "Server error while creating employee"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Employees
|--------------------------------------------------------------------------
| Search:
| ?search=mridul
|
| Filters:
| ?department=DEPARTMENT_ID
| ?status=Active
| ?employmentType=Full-Time
|
| Pagination:
| ?page=1&limit=10
*/
const getEmployees = async (req, res) => {
  try {
    const {
      search = "",
      department,
      status,
      employmentType,
      page = 1,
      limit = 10
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const employeeFilter = {};

    if (department) {
      if (!isValidObjectId(department)) {
        return res.status(400).json({
          message: "Invalid department ID"
        });
      }

      employeeFilter.department = department;
    }

    if (status) {
      const allowedStatuses = [
        "Active",
        "Inactive",
        "Resigned",
        "Terminated"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Invalid employment status"
        });
      }

      employeeFilter.employmentStatus =
        status;
    }

    if (employmentType) {
      const allowedTypes = [
        "Full-Time",
        "Part-Time",
        "Intern",
        "Contract"
      ];

      if (
        !allowedTypes.includes(
          employmentType
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid employment type"
        });
      }

      employeeFilter.employmentType =
        employmentType;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select("_id");

      const matchingUserIds =
        matchingUsers.map((user) => user._id);

      employeeFilter.$or = [
        { employeeId: searchRegex },
        { designation: searchRegex },
        { phone: searchRegex },
        { user: { $in: matchingUserIds } }
      ];
    }

    const totalEmployees =
      await Employee.countDocuments(
        employeeFilter
      );

    const employees = await Employee.find(
      employeeFilter
    )
      .populate(employeePopulate)
      .sort({ createdAt: -1 })
      .skip(
        (currentPage - 1) * pageLimit
      )
      .limit(pageLimit);

    return res.status(200).json({
      employees,

      pagination: {
        currentPage,
        totalPages: Math.ceil(
          totalEmployees / pageLimit
        ),
        totalEmployees,
        limit: pageLimit
      }
    });
  } catch (error) {
    console.error(
      "Get employees error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while loading employees"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Employee by MongoDB ID
|--------------------------------------------------------------------------
*/
const getEmployeeById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID"
      });
    }

    const employee =
      await Employee.findById(id).populate(
        employeePopulate
      );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    /*
      Employees may only view their own record.
      Admin can view every employee.
    */
    if (
      req.user.role === "Employee" &&
      employee.user._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only view your own employee profile"
      });
    }

    return res.status(200).json({
      employee
    });
  } catch (error) {
    console.error(
      "Get employee error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while loading employee"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Logged-in Employee's Own Profile
|--------------------------------------------------------------------------
*/
const getMyEmployeeProfile = async (
  req,
  res
) => {
  try {
    const employee = await Employee.findOne({
      user: req.user._id
    }).populate(employeePopulate);

    if (!employee) {
      return res.status(404).json({
        message:
          "Employee profile not found"
      });
    }

    return res.status(200).json({
      employee
    });
  } catch (error) {
    console.error(
      "Get my employee profile error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while loading employee profile"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
| Admin updates employee and user account details.
*/
const updateEmployee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID"
      });
    }

    const employee =
      await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const user = await User.findById(
      employee.user
    );

    if (!user) {
      return res.status(404).json({
        message:
          "Employee user account not found"
      });
    }

    const {
      name,
      email,
      department,
      designation,
      employmentType,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      joiningDate,
      salary,
      manager,
      profileImage
    } = req.body;

    if (email !== undefined) {
      const normalizedEmail = email
        .trim()
        .toLowerCase();

      const duplicateUser =
        await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id }
        });

      if (duplicateUser) {
        return res.status(409).json({
          message:
            "Another user already uses this email"
        });
      }

      user.email = normalizedEmail;
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty"
        });
      }

      user.name = name.trim();
    }

    if (department !== undefined) {
      if (!isValidObjectId(department)) {
        return res.status(400).json({
          message: "Invalid department ID"
        });
      }

      const selectedDepartment =
        await Department.findById(
          department
        );

      if (!selectedDepartment) {
        return res.status(404).json({
          message: "Department not found"
        });
      }

      if (!selectedDepartment.isActive) {
        return res.status(400).json({
          message:
            "Cannot assign employee to an inactive department"
        });
      }

      employee.department = department;
    }

    if (manager !== undefined) {
      if (
        manager !== null &&
        manager !== ""
      ) {
        if (!isValidObjectId(manager)) {
          return res.status(400).json({
            message: "Invalid manager ID"
          });
        }

        if (manager === id) {
          return res.status(400).json({
            message:
              "An employee cannot be their own manager"
          });
        }

        const selectedManager =
          await Employee.findById(manager);

        if (!selectedManager) {
          return res.status(404).json({
            message: "Manager not found"
          });
        }

        if (
          selectedManager.employmentStatus !==
          "Active"
        ) {
          return res.status(400).json({
            message:
              "Only an active employee can be assigned as manager"
          });
        }

        employee.manager = manager;
      } else {
        employee.manager = null;
      }
    }

    if (designation !== undefined) {
      if (!designation.trim()) {
        return res.status(400).json({
          message:
            "Designation cannot be empty"
        });
      }

      employee.designation =
        designation.trim();
    }

    if (employmentType !== undefined) {
      const allowedTypes = [
        "Full-Time",
        "Part-Time",
        "Intern",
        "Contract"
      ];

      if (
        !allowedTypes.includes(
          employmentType
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid employment type"
        });
      }

      employee.employmentType =
        employmentType;
    }

    if (phone !== undefined) {
      employee.phone = phone.trim();
    }

    if (dateOfBirth !== undefined) {
      employee.dateOfBirth =
        dateOfBirth || null;
    }

    if (gender !== undefined) {
      employee.gender = gender;
    }

    if (address !== undefined) {
      employee.address = {
        street:
          address.street !== undefined
            ? address.street.trim()
            : employee.address.street,

        city:
          address.city !== undefined
            ? address.city.trim()
            : employee.address.city,

        state:
          address.state !== undefined
            ? address.state.trim()
            : employee.address.state,

        country:
          address.country !== undefined
            ? address.country.trim()
            : employee.address.country,

        postalCode:
          address.postalCode !== undefined
            ? address.postalCode.trim()
            : employee.address.postalCode
      };
    }

    if (emergencyContact !== undefined) {
      employee.emergencyContact = {
        name:
          emergencyContact.name !==
          undefined
            ? emergencyContact.name.trim()
            : employee.emergencyContact
                .name,

        relationship:
          emergencyContact.relationship !==
          undefined
            ? emergencyContact.relationship.trim()
            : employee.emergencyContact
                .relationship,

        phone:
          emergencyContact.phone !==
          undefined
            ? emergencyContact.phone.trim()
            : employee.emergencyContact
                .phone
      };
    }

    if (joiningDate !== undefined) {
      const parsedJoiningDate = new Date(
        joiningDate
      );

      if (
        Number.isNaN(
          parsedJoiningDate.getTime()
        )
      ) {
        return res.status(400).json({
          message: "Invalid joining date"
        });
      }

      employee.joiningDate =
        parsedJoiningDate;
    }

    if (salary !== undefined) {
      if (Number(salary) < 0) {
        return res.status(400).json({
          message:
            "Salary cannot be negative"
        });
      }

      employee.salary = Number(salary);
    }

    if (profileImage !== undefined) {
      employee.profileImage =
        profileImage.trim();
    }

    await user.save();
await employee.save();

const populatedEmployee =
  await Employee.findById(id).populate(
    employeePopulate
  );

/*
|--------------------------------------------------------------------------
| Activity Log
|--------------------------------------------------------------------------
*/

await createActivityLog({
  req,
  action: "UPDATE",
  module: "Employee",
  description: `Updated employee ${user.name} (${employee.employeeId})`,
  targetId: employee._id,
  targetModel: "Employee",
  metadata: {
    updatedFields: Object.keys(req.body),
    employeeId: employee.employeeId,
    name: user.name,
    email: user.email,
    designation: employee.designation,
    employmentType:
      employee.employmentType,
    employmentStatus:
      employee.employmentStatus
  }
});

return res.status(200).json({
  message:
    "Employee updated successfully",
  employee: populatedEmployee
});
  } catch (error) {
    console.error(
      "Update employee error:",
      error
    );

    if (error.name === "ValidationError") {
      const validationMessage =
        Object.values(error.errors)
          .map((item) => item.message)
          .join(", ");

      return res.status(400).json({
        message: validationMessage
      });
    }

    return res.status(500).json({
      message:
        "Server error while updating employee"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Employment Status
|--------------------------------------------------------------------------
| Soft deletion and account reactivation are handled here.
*/
const updateEmployeeStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      employmentStatus,
      deactivationReason = ""
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID"
      });
    }

    const allowedStatuses = [
      "Active",
      "Inactive",
      "Resigned",
      "Terminated"
    ];

    if (
      !allowedStatuses.includes(
        employmentStatus
      )
    ) {
      return res.status(400).json({
        message:
          "Status must be Active, Inactive, Resigned or Terminated"
      });
    }

    const employee =
      await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    const user = await User.findById(
      employee.user
    );

    if (!user) {
      return res.status(404).json({
        message:
          "Employee user account not found"
      });
    }

    employee.employmentStatus =
      employmentStatus;

    if (employmentStatus === "Active") {
      user.isActive = true;
      employee.leavingDate = null;
      employee.deactivationReason = "";
    } else {
      user.isActive = false;
      employee.leavingDate = new Date();
      employee.deactivationReason =
        deactivationReason.trim();

      /*
        Remove an inactive employee as manager
        from employees reporting to them.
      */
      await Employee.updateMany(
        { manager: employee._id },
        { $set: { manager: null } }
      );
    }

    await user.save();
    await employee.save();

    const populatedEmployee =
  await Employee.findById(id).populate(
    employeePopulate
  );

/*
|--------------------------------------------------------------------------
| Activity Log
|--------------------------------------------------------------------------
*/

let action = "UPDATE";

switch (employmentStatus) {
  case "Active":
    action = "ACTIVATE";
    break;

  case "Inactive":
    action = "DEACTIVATE";
    break;

  case "Resigned":
    action = "UPDATE";
    break;

  case "Terminated":
    action = "UPDATE";
    break;

  default:
    action = "UPDATE";
}

await createActivityLog({
  req,
  action,
  module: "Employee",
  description: `Changed employment status of ${user.name} (${employee.employeeId}) to ${employmentStatus}`,
  targetId: employee._id,
  targetModel: "Employee",
  metadata: {
    employeeId: employee.employeeId,
    status: employmentStatus,
    reason:
      employee.deactivationReason || ""
  }
});

return res.status(200).json({
  message:
    employmentStatus === "Active"
      ? "Employee account activated successfully"
      : `Employee marked as ${employmentStatus} successfully`,

  employee: populatedEmployee
});
  } catch (error) {
    console.error(
      "Update employee status error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while updating employee status"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Soft Delete Employee
|--------------------------------------------------------------------------
| Nothing is permanently deleted.
| Employee becomes Inactive and cannot log in.
*/
const deleteEmployee = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid employee ID"
      });
    }

    const employee =
      await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    if (
      employee.employmentStatus ===
      "Inactive"
    ) {
      return res.status(400).json({
        message:
          "Employee is already inactive"
      });
    }

    const user = await User.findById(
      employee.user
    );

    const previousStatus =
      employee.employmentStatus;

    employee.employmentStatus =
      "Inactive";

    employee.leavingDate = new Date();

    employee.deactivationReason =
      req.body.deactivationReason?.trim() ||
      "Employee account deactivated by Admin";

    if (user) {
      user.isActive = false;
      await user.save();
    }

    await Employee.updateMany(
      { manager: employee._id },
      { $set: { manager: null } }
    );

    /*
      If this employee was a department head,
      remove them as department head.
    */
    await Department.updateMany(
      { departmentHead: employee._id },
      { $set: { departmentHead: null } }
    );

    await employee.save();

    /*
    |--------------------------------------------------------------------------
    | Activity Log
    |--------------------------------------------------------------------------
    */

    await createActivityLog({
      req,
      action: "DELETE",
      module: "Employee",
      description: `Deactivated employee ${
        user?.name || "Unknown Employee"
      } (${employee.employeeId})`,
      targetId: employee._id,
      targetModel: "Employee",
      metadata: {
        employeeId: employee.employeeId,
        previousStatus,
        newStatus: "Inactive",
        reason:
          employee.deactivationReason
      }
    });

    return res.status(200).json({
      message:
        "Employee deactivated successfully. Historical data has been preserved."
    });
  } catch (error) {
    console.error(
      "Delete employee error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while deactivating employee"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Employee Statistics
|--------------------------------------------------------------------------
*/
const getEmployeeStats = async (
  req,
  res
) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      resignedEmployees,
      terminatedEmployees,
      fullTimeEmployees,
      partTimeEmployees,
      interns,
      contractors
    ] = await Promise.all([
      Employee.countDocuments(),

      Employee.countDocuments({
        employmentStatus: "Active"
      }),

      Employee.countDocuments({
        employmentStatus: "Inactive"
      }),

      Employee.countDocuments({
        employmentStatus: "Resigned"
      }),

      Employee.countDocuments({
        employmentStatus: "Terminated"
      }),

      Employee.countDocuments({
        employmentType: "Full-Time"
      }),

      Employee.countDocuments({
        employmentType: "Part-Time"
      }),

      Employee.countDocuments({
        employmentType: "Intern"
      }),

      Employee.countDocuments({
        employmentType: "Contract"
      })
    ]);

    const departmentDistribution =
      await Employee.aggregate([
        {
          $group: {
            _id: "$department",
            employeeCount: { $sum: 1 },
            activeEmployeeCount: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$employmentStatus",
                      "Active"
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "department"
          }
        },
        {
          $unwind: "$department"
        },
        {
          $project: {
            _id: 0,
            departmentId:
              "$department._id",
            name: "$department.name",
            code: "$department.code",
            employeeCount: 1,
            activeEmployeeCount: 1
          }
        },
        {
          $sort: {
            employeeCount: -1
          }
        }
      ]);

    return res.status(200).json({
      stats: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        resignedEmployees,
        terminatedEmployees,

        employmentTypes: {
          fullTimeEmployees,
          partTimeEmployees,
          interns,
          contractors
        },

        departmentDistribution
      }
    });
  } catch (error) {
    console.error(
      "Employee stats error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while loading employee statistics"
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyEmployeeProfile,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployeeStats
};