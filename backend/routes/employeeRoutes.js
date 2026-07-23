const express = require("express");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getMyEmployeeProfile,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  getEmployeeStats
} = require(
  "../controllers/employeeController"
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
| Employee's own profile
|--------------------------------------------------------------------------
*/
router.get(
  "/me",
  roleMiddleware("Employee"),
  getMyEmployeeProfile
);

/*
|--------------------------------------------------------------------------
| Employee statistics
|--------------------------------------------------------------------------
| Admin and HR can view workforce statistics.
|--------------------------------------------------------------------------
*/
router.get(
  "/stats",
  roleMiddleware("Admin", "HR"),
  getEmployeeStats
);

/*
|--------------------------------------------------------------------------
| Employee CRUD
|--------------------------------------------------------------------------
*/

// Admin and HR can create employees
router.post(
  "/",
  roleMiddleware("Admin", "HR"),
  createEmployee
);

// Admin and HR can view all employees
router.get(
  "/",
  roleMiddleware("Admin", "HR"),
  getEmployees
);

// Admin and HR can view any employee.
// Employee access must still be restricted inside the controller.
router.get(
  "/:id",
  roleMiddleware(
    "Admin",
    "HR",
    "Employee"
  ),
  getEmployeeById
);

// Admin and HR can update employee details
router.put(
  "/:id",
  roleMiddleware("Admin", "HR"),
  updateEmployee
);

// Admin and HR can activate or deactivate employees
router.patch(
  "/:id/status",
  roleMiddleware("Admin", "HR"),
  updateEmployeeStatus
);

// Permanent deletion remains Admin-only
router.delete(
  "/:id",
  roleMiddleware("Admin"),
  deleteEmployee
);

module.exports = router;