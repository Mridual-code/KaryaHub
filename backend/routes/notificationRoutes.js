const express = require("express");

const {
  getMyNotifications,
  getUnreadNotificationCount,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearMyNotifications
} = require(
  "../controllers/notificationController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  getMyNotifications
);

router.get(
  "/unread-count",
  getUnreadNotificationCount
);

router.patch(
  "/read-all",
  markAllNotificationsAsRead
);

router.delete(
  "/clear",
  clearMyNotifications
);

router.get(
  "/:id",
  getNotificationById
);

router.patch(
  "/:id/read",
  markNotificationAsRead
);

router.delete(
  "/:id",
  deleteNotification
);

module.exports = router;