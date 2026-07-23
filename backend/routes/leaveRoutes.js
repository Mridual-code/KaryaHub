const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  applyForLeave,
  getMyLeaves,
  getAllLeaves,
  getLeaveById,
  updateLeaveStatus,
  cancelLeave,
  getLeaveStats
} = require(
  "../controllers/leaveController"
);

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| Employee leave routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  roleMiddleware("Employee"),
  applyForLeave
);

router.get(
  "/my",
  roleMiddleware("Employee"),
  getMyLeaves
);

router.patch(
  "/:id/cancel",
  roleMiddleware("Employee"),
  cancelLeave
);

/*
|--------------------------------------------------------------------------
| Admin and HR leave routes
|--------------------------------------------------------------------------
*/

router.get(
  "/stats",
  roleMiddleware("Admin", "HR"),
  getLeaveStats
);

router.get(
  "/",
  roleMiddleware("Admin", "HR"),
  getAllLeaves
);

/*
|--------------------------------------------------------------------------
| Shared leave route
|--------------------------------------------------------------------------
| Employees must be restricted inside the controller to their own requests.
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  roleMiddleware(
    "Admin",
    "HR",
    "Employee"
  ),
  getLeaveById
);

router.patch(
  "/:id/status",
  roleMiddleware("Admin", "HR"),
  updateLeaveStatus
);

module.exports = router;