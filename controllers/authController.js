const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const { verifyGoogleToken } = require('../config/googleOAuth');
const { sendEmail } = require('../utils/emailService');
const { success, error } = require('../utils/response');

// ----------------------------
// USER SIGNUP
// ----------------------------
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !role) {
    return error(res, "Missing required fields");
  }

  const existing = await User.findOne({ email });
  if (existing) return error(res, "Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    passwordHash: hashed,
    role,
    department,
    status: "pending"   // Admin must approve
  });

  await user.save();

  return success(res, "Signup successful. Wait for admin approval.");
});

// ----------------------------
// USER LOGIN
// ----------------------------
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return error(res, "Missing credentials");

  const user = await User.findOne({ email });
  if (!user) return error(res, "Invalid credentials");

  if (user.status !== "active")
    return error(res, "Account not active. Contact Admin.");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return error(res, "Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return success(res, "Login successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ----------------------------
// GOOGLE LOGIN
// ----------------------------
exports.googleLogin = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) return error(res, "Missing Google token");

  const { name, email } = await verifyGoogleToken(tokenId);

  let user = await User.findOne({ email });

  // If first time login → auto-create active user
  if (!user) {
    user = await User.create({
      name,
      email,
      passwordHash: "",
      role: "employee",
      status: "active"
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  return success(res, "Google login successful", {
    token,
    user: {
      id: user._id,
      name,
      email,
      role: user.role
    }
  });
});

// ----------------------------
// FORGOT PASSWORD
// ----------------------------
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return error(res, "Email not found");

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + (60 * 60 * 1000);
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: `<p>Click the link to reset: <a href="${resetLink}">${resetLink}</a></p>`
  });

  return success(res, "Password reset link sent");
});

// ----------------------------
// RESET PASSWORD
// ----------------------------
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return error(res, "Invalid or expired reset token");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return success(res, "Password updated successfully");
});
