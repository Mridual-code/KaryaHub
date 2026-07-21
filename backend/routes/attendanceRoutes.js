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

// Employee routes
router.post(
  "/check-in",
  authMiddleware,
  roleMiddleware("Employee"),
  checkIn
);

router.patch(
  "/check-out",
  authMiddleware,
  roleMiddleware("Employee"),
  checkOut
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("Employee"),
  getMyAttendance
);

router.get(
  "/today",
  authMiddleware,
  roleMiddleware("Employee"),
  getTodayAttendance
);

// Admin routes
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("Admin"),
  getAttendanceStats
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  getAllAttendance
);

router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("Admin"),
  markAttendance
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  updateAttendance
);

module.exports = router;