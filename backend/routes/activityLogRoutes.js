const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  getActivityLogs,
  getActivityLogById,
  getRecentActivityLogs,
  getActivityLogStats,
  deleteActivityLog,
  clearActivityLogs
} = require(
  "../controllers/activityLogController"
);

/*
|--------------------------------------------------------------------------
| All Activity Log Routes
|--------------------------------------------------------------------------
| Only Admin can access activity logs.
|--------------------------------------------------------------------------
*/

router.use(
  authMiddleware,
  roleMiddleware("Admin")
);

router.get(
  "/",
  getActivityLogs
);

router.get(
  "/recent",
  getRecentActivityLogs
);

router.get(
  "/stats",
  getActivityLogStats
);

router.delete(
  "/clear",
  clearActivityLogs
);

router.get(
  "/:id",
  getActivityLogById
);

router.delete(
  "/:id",
  deleteActivityLog
);

module.exports = router;