const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const connectDatabase = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require(
  "./routes/departmentRoutes"
);
const employeeRoutes = require(
  "./routes/employeeRoutes"
);
const leaveRoutes = require(
  "./routes/leaveRoutes"
);
const attendanceRoutes = require(
  "./routes/attendanceRoutes"
);
const dashboardRoutes = require(
  "./routes/dashboardRoutes"
);
const dashboardChartRoutes = require(
  "./routes/dashboardChartRoutes"
);
const activityLogRoutes = require(
  "./routes/activityLogRoutes"
);
const notificationRoutes = require(
  "./routes/notificationRoutes"
);
const reportRoutes = require(
  "./routes/reportRoutes"
);

const attendanceCalendarRoutes = require(
  "./routes/attendanceCalendarRoutes"
);
const profilePictureRoutes = require(
  "./routes/profilePictureRoutes"
);

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/public",
  express.static(
    path.join(__dirname, "public")
  )
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
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

app.use(
  "/api/leaves",
  leaveRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);



app.use(
  "/api/dashboard/charts",
  dashboardChartRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/activity-logs",
  activityLogRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);


app.use(
  "/api/attendance-calendar",
  attendanceCalendarRoutes
);

app.use(
  "/api/profile-picture",
  profilePictureRoutes
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (
    error.name === "MulterError" &&
    error.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Profile picture must be smaller than 5 MB"
    });
  }

  if (
    error.message ===
    "Only JPG, JPEG, PNG and WEBP images are allowed"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message:
      error.message ||
      "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `KaryaHub server running on port ${PORT}`
  );
});