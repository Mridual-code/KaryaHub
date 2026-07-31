const express = require("express");

const {
  loginUser,
  getProfile
} = require("../controllers/authController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth route works"
  });
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

// Login
router.post("/login", loginUser);

// Logged-in user profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;