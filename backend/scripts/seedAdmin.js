// Run with: node scripts/seedAdmin.js
// Creates a default admin account so you can log in immediately.
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const mongoose = require("mongoose");

const run = async () => {
  await connectDB();

  const adminEmail = "admin@globalindustrialjob.com";
  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    console.log("Admin already exists:", adminEmail);
  } else {
    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: "Admin@123",
      role: "admin",
    });
    console.log("Admin created!");
    console.log("Email:    admin@globalindustrialjob.com");
    console.log("Password: Admin@123");
  }

  await mongoose.connection.close();
  process.exit(0);
};

run();
