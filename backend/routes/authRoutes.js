const express = require("express");

const {
  loginUser,
  getProfile
} = require("../controllers/authController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth route works" });
});
router.post("/login", loginUser);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;