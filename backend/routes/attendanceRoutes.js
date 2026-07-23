const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayAttendance,
  getAllAttendance,
  markAttendance,
  updateAttendance,
  getAttendanceStats
} = require(
  "../controllers/attendanceController"
);

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Employee attendance routes
|--------------------------------------------------------------------------
*/

router.post(
  "/check-in",
  roleMiddleware("Employee"),
  checkIn
);

router.patch(
  "/check-out",
  roleMiddleware("Employee"),
  checkOut
);

router.get(
  "/my",
  roleMiddleware("Employee"),
  getMyAttendance
);

router.get(
  "/today",
  roleMiddleware("Employee"),
  getTodayAttendance
);

/*
|--------------------------------------------------------------------------
| Admin and HR attendance routes
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  roleMiddleware("Admin", "HR"),
  getAttendanceStats
);

router.get(
  "/",
  roleMiddleware("Admin", "HR"),
  getAllAttendance
);

router.post(
  "/mark",
  roleMiddleware("Admin", "HR"),
  markAttendance
);

router.put(
  "/:id",
  roleMiddleware("Admin", "HR"),
  updateAttendance
);

module.exports = router;