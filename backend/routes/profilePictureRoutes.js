const express = require("express");

const {
  uploadMyProfilePicture,
  deleteMyProfilePicture
} = require(
  "../controllers/profilePictureController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const {
  uploadProfilePicture
} = require(
  "../middleware/uploadMiddleware"
);

const router = express.Router();

router.patch(
  "/",
  authMiddleware,
  roleMiddleware("Employee"),
  uploadProfilePicture.single(
    "profilePicture"
  ),
  uploadMyProfilePicture
);

router.delete(
  "/",
  authMiddleware,
  roleMiddleware("Employee"),
  deleteMyProfilePicture
);

module.exports = router;