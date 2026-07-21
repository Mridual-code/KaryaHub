const express = require("express");

const router = express.Router();

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

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin"),
  getAdminDashboard
);

module.exports = router;