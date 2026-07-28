const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {

    getProfile,
    updateProfile,
    changePassword,

} = require(
    "../controllers/userController"
);

router.use(authMiddleware);

router.get(
    "/profile",
    getProfile
);

router.put(
    "/profile",
    updateProfile
);

router.put(
    "/change-password",
    changePassword
);

module.exports = router;