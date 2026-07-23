console.log("Dashboard summary routes loaded");

const express = require("express");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  getAdminDashboard
} = require(
  "../controllers/adminDashboardController"
);

const {
  getHrDashboard
} = require(
  "../controllers/hrDashboardController"
);

const {
  getEmployeeDashboard
} = require(
  "../controllers/employeeDashboardController"
);

const router = express.Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  roleMiddleware("Admin"),
  getAdminDashboard
);

/*
|--------------------------------------------------------------------------
| HR Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/hr",
  roleMiddleware("HR"),
  getHrDashboard
);

/*
|--------------------------------------------------------------------------
| Employee Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/employee",
  roleMiddleware("Employee"),
  getEmployeeDashboard
);

module.exports = router;