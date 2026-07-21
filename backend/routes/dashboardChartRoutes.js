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
  roleMiddleware("Admin"),
  getDepartmentChart
);

router.get(
  "/attendance",
  authMiddleware,
  roleMiddleware("Admin"),
  getAttendanceChart
);

router.get(
  "/leaves",
  authMiddleware,
  roleMiddleware("Admin"),
  getLeaveChart
);

router.get(
  "/hiring",
  authMiddleware,
  roleMiddleware("Admin"),
  getHiringChart
);

router.get(
  "/attendance-trend",
  authMiddleware,
  roleMiddleware("Admin"),
  getAttendanceTrend
);

router.get(
  "/leave-trend",
  authMiddleware,
  roleMiddleware("Admin"),
  getLeaveTrend
);

router.get(
  "/status",
  authMiddleware,
  roleMiddleware("Admin"),
  getEmployeeStatusChart
);

module.exports = router;