require("dotenv").config();

const mongoose = require("mongoose");

const connectDatabase = require(
  "../config/db"
);

const seedSystemUsers = require(
  "./userSeeder"
);

const runSeeder = async () => {
  try {
    await connectDatabase();

    await seedSystemUsers();

    console.log(
      "Database seeding completed"
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      `Seeder failed: ${error.message}`
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

runSeeder();