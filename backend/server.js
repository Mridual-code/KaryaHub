const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require(
  "./routes/departmentRoutes"
);
const adminDashboardRoutes = require(
  "./routes/adminDashboardRoutes"
);

const app = express();
const employeeRoutes = require(
  "./routes/employeeRoutes"
);
const leaveRoutes = require(
  "./routes/leaveRoutes"
);

const attendanceRoutes = require(
  "./routes/attendanceRoutes"
);
const dashboardChartRoutes = require(
  "./routes/dashboardChartRoutes"
);
const activityLogRoutes = require(
  "./routes/activityLogRoutes"
);
connectDatabase();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "KaryaHub API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/departments",
  departmentRoutes
);
app.use(
  "/api/employees",
  employeeRoutes
);
app.use("/api/leaves", leaveRoutes);

app.use(
  "/api/attendance",
  attendanceRoutes
);
app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);
app.use(
  "/api/dashboard/charts",
  dashboardChartRoutes
);
app.use(
  "/api/activity-logs",
  activityLogRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `KaryaHub server running on port ${PORT}`
  );
});