const express = require("express");

const {
  getEmployeeDashboard
} = require(
  "../controllers/employeeDashboardController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Employee"),
  getEmployeeDashboard
);

module.exports = router;