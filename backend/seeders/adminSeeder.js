const User = require("../models/User");

const seedAdmin = async () => {
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  const adminName =
    process.env.ADMIN_NAME || "System Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be added to .env"
    );
  }

  const existingAdmin = await User.findOne({
    email: adminEmail
  });

  if (existingAdmin) {
    console.log(
      `Admin already exists: ${existingAdmin.email}`
    );

    return existingAdmin;
  }

  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: "Admin",
    isActive: true
  });

  console.log(
    `Admin created successfully: ${admin.email}`
  );

  return admin;
};

module.exports = seedAdmin;