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
| Admin statistics
|--------------------------------------------------------------------------
*/
router.get(
  "/stats",
  roleMiddleware("Admin"),
  getEmployeeStats
);

/*
|--------------------------------------------------------------------------
| Employee CRUD
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  roleMiddleware("Admin"),
  createEmployee
);

router.get(
  "/",
  roleMiddleware("Admin"),
  getEmployees
);

router.get(
  "/:id",
  roleMiddleware("Admin", "Employee"),
  getEmployeeById
);

router.put(
  "/:id",
  roleMiddleware("Admin"),
  updateEmployee
);

router.patch(
  "/:id/status",
  roleMiddleware("Admin"),
  updateEmployeeStatus
);

router.delete(
  "/:id",
  roleMiddleware("Admin"),
  deleteEmployee
);

module.exports = router;