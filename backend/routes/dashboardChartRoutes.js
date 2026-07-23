const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  getDepartmentChart,
  getAttendanceChart,
  getLeaveChart,
  getHiringChart,
  getAttendanceTrend,
  getLeaveTrend,
  getEmployeeStatusChart
} = require(
  "../controllers/dashboardChartController"
);

/*
|--------------------------------------------------------------------------
| Dashboard Chart Routes
|--------------------------------------------------------------------------
| All chart routes are accessible only by Admin.
|--------------------------------------------------------------------------
*/

router.get(
  "/department",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getDepartmentChart
);

router.get(
  "/attendance",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getAttendanceChart
);

router.get(
  "/leaves",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getLeaveChart
);

router.get(
  "/hiring",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getHiringChart
);

router.get(
  "/attendance-trend",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getAttendanceTrend
);

router.get(
  "/leave-trend",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getLeaveTrend
);

router.get(
  "/status",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getEmployeeStatusChart
);

module.exports = router;