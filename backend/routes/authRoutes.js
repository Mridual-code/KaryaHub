const express = require("express");

const {
  loginUser,
  getProfile
} = require("../controllers/authController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post("/login", loginUser);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;