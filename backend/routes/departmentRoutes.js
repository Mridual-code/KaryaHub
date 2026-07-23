const express = require("express");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require(
  "../controllers/departmentController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| View Departments
|--------------------------------------------------------------------------
| Admin, HR and Employees can view departments.
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  roleMiddleware(
    "Admin",
    "HR",
    "Employee"
  ),
  getDepartments
);

router.get(
  "/:id",
  roleMiddleware(
    "Admin",
    "HR",
    "Employee"
  ),
  getDepartmentById
);

/*
|--------------------------------------------------------------------------
| Department Management
|--------------------------------------------------------------------------
| Only Admin can modify departments.
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  roleMiddleware("Admin"),
  createDepartment
);

router.put(
  "/:id",
  roleMiddleware("Admin","HR"),
  updateDepartment
);

router.delete(
  "/:id",
  roleMiddleware("Admin"),
  deleteDepartment
);

module.exports = router;