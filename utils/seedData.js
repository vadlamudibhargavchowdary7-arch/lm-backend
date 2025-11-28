require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await connectDB(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: "admin@company.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "System Admin",
      email: "admin@company.com",
      passwordHash: hashedPassword,
      role: "admin",
      status: "active"
    });

    console.log("Admin user created:");
    console.log("Email: admin@company.com");
    console.log("Password: Admin@123");

    process.exit(0);

  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
}

seed();
