const User = require('../models/User');
const Policy = require('../models/Policy');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/response');

// -----------------------------------------
// GET ALL PENDING USERS (signup requests)
// -----------------------------------------
exports.getPendingUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ status: "pending" }).select("-passwordHash");
  return success(res, "Pending users fetched", users);
});

// -----------------------------------------
// APPROVE USER (activate account)
// -----------------------------------------
exports.approveUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return error(res, "User not found", 404);

  user.status = "active";
  await user.save();

  return success(res, "User approved");
});

// -----------------------------------------
// REJECT USER (disable account)
// -----------------------------------------
exports.rejectUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return error(res, "User not found", 404);

  user.status = "disabled";
  await user.save();

  return success(res, "User rejected");
});

// -----------------------------------------
// GET ALL POLICIES
// -----------------------------------------
exports.listPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find();
  return success(res, "Policies fetched", policies);
});

// -----------------------------------------
// CREATE NEW POLICY
// -----------------------------------------
exports.createPolicy = asyncHandler(async (req, res) => {
  const policy = new Policy(req.body);
  await policy.save();
  return success(res, "Policy created", policy);
});

// -----------------------------------------
// UPDATE POLICY
// -----------------------------------------
exports.updatePolicy = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const policy = await Policy.findByIdAndUpdate(id, req.body, { new: true });
  if (!policy) return error(res, "Policy not found");

  return success(res, "Policy updated", policy);
});

// -----------------------------------------
// DELETE POLICY
// -----------------------------------------
exports.deletePolicy = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Policy.findByIdAndDelete(id);

  return success(res, "Policy deleted");
});
