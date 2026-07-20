const express = require("express");

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require(
  "../controllers/departmentController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware("Admin", "Employee"),
  getDepartments
);

router.get(
  "/:id",
  roleMiddleware("Admin", "Employee"),
  getDepartmentById
);

router.post(
  "/",
  roleMiddleware("Admin"),
  createDepartment
);

router.put(
  "/:id",
  roleMiddleware("Admin"),
  updateDepartment
);

router.delete(
  "/:id",
  roleMiddleware("Admin"),
  deleteDepartment
);

module.exports = router;