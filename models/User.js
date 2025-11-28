const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },

    department: { type: String },

    status: {
      type: String,
      enum: ["active", "pending", "disabled"],
      default: "pending"
    },

    leaveBalance: {
      paid: { type: Number, default: 12 },
      sick: { type: Number, default: 8 },
      casual: { type: Number, default: 5 }
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
