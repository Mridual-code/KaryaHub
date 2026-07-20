const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require(
  "./routes/departmentRoutes"
);

const app = express();
const employeeRoutes = require(
  "./routes/employeeRoutes"
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `KaryaHub server running on port ${PORT}`
  );
});