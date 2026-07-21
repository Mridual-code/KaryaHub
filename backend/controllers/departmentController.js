const Department = require(
  "../models/Department"
);

const {
  createActivityLog
} = require(
  "../services/activityLogService"
);

const createDepartment = async (
  req,
  res
) => {
  try {
    const {
      name,
      code,
      description
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message:
          "Department name and code are required"
      });
    }

    const normalizedName =
      name.trim();

    const normalizedCode = code
      .trim()
      .toUpperCase();

    const existingDepartment =
      await Department.findOne({
        $or: [
          {
            name: {
              $regex: `^${normalizedName}$`,
              $options: "i"
            }
          },
          {
            code: normalizedCode
          }
        ]
      });

    if (existingDepartment) {
      return res.status(409).json({
        message:
          "Department with this name or code already exists"
      });
    }

    const department =
      await Department.create({
        name: normalizedName,
        code: normalizedCode,
        description:
          description?.trim() || "",
        createdBy: req.user._id
      });

    await createActivityLog({
      req,
      action: "CREATE",
      module: "Department",
      description: `Created department ${department.name} (${department.code})`,
      targetId: department._id,
      targetModel: "Department",
      metadata: {
        name: department.name,
        code: department.code,
        description:
          department.description,
        isActive:
          department.isActive
      }
    });

    return res.status(201).json({
      message:
        "Department created successfully",
      department
    });
  } catch (error) {
    console.error(
      "Create department error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while creating department"
    });
  }
};

const getDepartments = async (
  req,
  res
) => {
  try {
    const {
      search = "",
      status,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          code: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ];
    }

    if (status === "active") {
      query.isActive = true;
    }

    if (status === "inactive") {
      query.isActive = false;
    }

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      100
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    const [
      departments,
      totalDepartments
    ] = await Promise.all([
      Department.find(query)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "departmentHead",
          "employeeId designation"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Department.countDocuments(
        query
      )
    ]);

    return res.status(200).json({
      departments,
      pagination: {
        currentPage:
          pageNumber,
        totalPages: Math.ceil(
          totalDepartments /
            limitNumber
        ),
        totalDepartments,
        limit: limitNumber
      }
    });
  } catch (error) {
    console.error(
      "Get departments error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while loading departments"
    });
  }
};

const getDepartmentById = async (
  req,
  res
) => {
  try {
    const department =
      await Department.findById(
        req.params.id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "departmentHead",
          "employeeId designation"
        );

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found"
      });
    }

    return res.status(200).json({
      department
    });
  } catch (error) {
    console.error(
      "Get department error:",
      error
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res.status(400).json({
        message:
          "Invalid department ID"
      });
    }

    return res.status(500).json({
      message:
        "Server error while loading department"
    });
  }
};

const updateDepartment = async (
  req,
  res
) => {
  try {
    const {
      name,
      code,
      description,
      isActive
    } = req.body;

    const department =
      await Department.findById(
        req.params.id
      );

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found"
      });
    }

    const previousData = {
      name: department.name,
      code: department.code,
      description:
        department.description,
      isActive:
        department.isActive
    };

    const normalizedName =
      name?.trim() ||
      department.name;

    const normalizedCode =
      code?.trim().toUpperCase() ||
      department.code;

    const duplicateDepartment =
      await Department.findOne({
        _id: {
          $ne: department._id
        },
        $or: [
          {
            name: {
              $regex: `^${normalizedName}$`,
              $options: "i"
            }
          },
          {
            code:
              normalizedCode
          }
        ]
      });

    if (
      duplicateDepartment
    ) {
      return res.status(409).json({
        message:
          "Another department already uses this name or code"
      });
    }

    department.name =
      normalizedName;

    department.code =
      normalizedCode;

    if (
      description !==
      undefined
    ) {
      department.description =
        description.trim();
    }

    if (
      typeof isActive ===
      "boolean"
    ) {
      department.isActive =
        isActive;
    }

    await department.save();

    let action = "UPDATE";

    if (
      previousData.isActive !==
      department.isActive
    ) {
      action =
        department.isActive
          ? "ACTIVATE"
          : "DEACTIVATE";
    }

    await createActivityLog({
      req,
      action,
      module: "Department",
      description:
        action === "ACTIVATE"
          ? `Activated department ${department.name} (${department.code})`
          : action ===
              "DEACTIVATE"
            ? `Deactivated department ${department.name} (${department.code})`
            : `Updated department ${department.name} (${department.code})`,
      targetId:
        department._id,
      targetModel:
        "Department",
      metadata: {
        updatedFields:
          Object.keys(req.body),
        previousData,
        newData: {
          name:
            department.name,
          code:
            department.code,
          description:
            department.description,
          isActive:
            department.isActive
        }
      }
    });

    return res.status(200).json({
      message:
        "Department updated successfully",
      department
    });
  } catch (error) {
    console.error(
      "Update department error:",
      error
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res.status(400).json({
        message:
          "Invalid department ID"
      });
    }

    return res.status(500).json({
      message:
        "Server error while updating department"
    });
  }
};

const deleteDepartment = async (
  req,
  res
) => {
  try {
    const department =
      await Department.findById(
        req.params.id
      );

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found"
      });
    }

    const deletedDepartmentData = {
      id: department._id,
      name: department.name,
      code: department.code,
      description:
        department.description,
      isActive:
        department.isActive
    };

    await department.deleteOne();

    await createActivityLog({
      req,
      action: "DELETE",
      module: "Department",
      description: `Deleted department ${deletedDepartmentData.name} (${deletedDepartmentData.code})`,
      targetId:
        deletedDepartmentData.id,
      targetModel:
        "Department",
      metadata: {
        name:
          deletedDepartmentData.name,
        code:
          deletedDepartmentData.code,
        description:
          deletedDepartmentData.description,
        previousStatus:
          deletedDepartmentData.isActive
            ? "Active"
            : "Inactive"
      }
    });

    return res.status(200).json({
      message:
        "Department deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete department error:",
      error
    );

    if (
      error.name ===
      "CastError"
    ) {
      return res.status(400).json({
        message:
          "Invalid department ID"
      });
    }

    return res.status(500).json({
      message:
        "Server error while deleting department"
    });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
};