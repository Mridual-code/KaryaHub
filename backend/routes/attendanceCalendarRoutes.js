const express = require("express");

const {
  getMyAttendanceCalendar,
  getEmployeeAttendanceCalendar
} = require(
  "../controllers/attendanceCalendarController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("Employee"),
  getMyAttendanceCalendar
);

router.get(
  "/employee/:employeeId",
  authMiddleware,
  roleMiddleware("Admin","HR"),
  getEmployeeAttendanceCalendar
);

module.exports = router;