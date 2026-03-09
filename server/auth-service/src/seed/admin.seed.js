require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const { hashPassword } = require("../utils/password");
const connectDB = require("../config/connectDB");

(async () => {
  try {
    await connectDB();

    const adminEmail = "admin@company.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await hashPassword("Admin@123");

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Admin seed failed:", error.message);
    process.exit(1);
  }
})();
