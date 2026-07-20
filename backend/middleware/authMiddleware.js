const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Authentication token required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(401).json({
        message: "User associated with token not found"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account is inactive"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token"
      });
    }

    console.error(
      "Authentication middleware error:",
      error
    );

    return res.status(500).json({
      message: "Server authentication error"
    });
  }
};

module.exports = authMiddleware;