const express = require("express");

const {
  exportEmployeesCsv,
  exportAttendanceCsv,
  exportLeavesCsv
} = require(
  "../controllers/reportController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
| Admin and HR can export reports.
|--------------------------------------------------------------------------
*/

router.use(
  authMiddleware,
  roleMiddleware("Admin", "HR")
);

router.get(
  "/employees/csv",
  exportEmployeesCsv
);

router.get(
  "/attendance/csv",
  exportAttendanceCsv
);

router.get(
  "/leaves/csv",
  exportLeavesCsv
);

module.exports = router;