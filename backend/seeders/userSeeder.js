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

  let admin = await User.findOne({
    email: adminEmail
  });

  if (admin) {
    console.log(
      `Admin already exists: ${admin.email}`
    );
  } else {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "Admin",
      isActive: true
    });

    console.log(
      `Admin created successfully: ${admin.email}`
    );
  }

  return admin;
};

const seedHR = async () => {
  const hrEmail =
    process.env.HR_EMAIL?.trim().toLowerCase();

  const hrPassword =
    process.env.HR_PASSWORD;

  const hrName =
    process.env.HR_NAME || "HR Manager";

  if (!hrEmail || !hrPassword) {
    throw new Error(
      "HR_EMAIL and HR_PASSWORD must be added to .env"
    );
  }

  let hrUser = await User.findOne({
    email: hrEmail
  });

  if (hrUser) {
    console.log(
      `HR user already exists: ${hrUser.email}`
    );
  } else {
    hrUser = await User.create({
      name: hrName,
      email: hrEmail,
      password: hrPassword,
      role: "HR",
      isActive: true
    });

    console.log(
      `HR user created successfully: ${hrUser.email}`
    );
  }

  return hrUser;
};

const seedSystemUsers = async () => {
  const admin = await seedAdmin();
  const hr = await seedHR();

  return {
    admin,
    hr
  };
};

module.exports = seedSystemUsers;