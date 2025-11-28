const Leave = require('../models/Leave');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/response');
const { notify } = require('../notifications/socket');

// -----------------------------------------
// APPLY LEAVE (Employee / Manager)
// -----------------------------------------
exports.applyLeave = asyncHandler(async (req, res) => {
  const { type, startDate, endDate, days, reason } = req.body;

  if (!startDate || !endDate || !days) {
    return error(res, "Missing leave details");
  }

  // Find manager of the same department
  const manager = await User.findOne({
    role: "manager",
    department: req.user.department
  });

  const leave = new Leave({
    employee: req.user._id,
    type,
    startDate,
    endDate,
    days,
    reason,
    manager: manager ? manager._id : null
  });

  await leave.save();

  // Notify manager
  if (manager) {
    notify(manager._id, {
      title: "New Leave Request",
      message: `${req.user.name} applied for leave`
    });
  }

  return success(res, "Leave applied successfully", leave);
});

// -----------------------------------------
// MANAGER → VIEW PENDING LEAVES
// -----------------------------------------
exports.managerPending = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({
    manager: req.user._id,
    status: "pending"
  }).populate("employee", "name email");

  return success(res, "Pending leaves fetched", leaves);
});

// -----------------------------------------
// MANAGER → APPROVE / REJECT
// -----------------------------------------
exports.managerDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  const leave = await Leave.findById(id);
  if (!leave) return error(res, "Leave not found", 404);

  if (decision === "approve") {
    leave.status = "manager_approved";
  } else {
    leave.status = "manager_rejected";
  }

  await leave.save();

  notify(leave.employee, {
    title: "Leave Status Update",
    message:
      decision === "approve"
        ? "Manager approved your leave"
        : "Manager rejected your leave"
  });

  return success(res, "Manager decision updated", leave);
});

// -----------------------------------------
// ADMIN → LIST ALL LEAVES
// -----------------------------------------
exports.listAll = asyncHandler(async (req, res) => {
  const leaves = await Leave.find()
    .populate("employee", "name email")
    .populate("manager", "name");

  return success(res, "All leaves fetched", leaves);
});

// -----------------------------------------
// ADMIN → FINAL APPROVAL
// -----------------------------------------
exports.adminDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  const leave = await Leave.findById(id);
  if (!leave) return error(res, "Leave not found", 404);

  if (decision === "approve") {
    leave.status = "admin_approved";

    // Deduct leave balance
    const employee = await User.findById(leave.employee);

    if (employee) {
      if (leave.type === "paid") employee.leaveBalance.paid -= leave.days;
      if (leave.type === "sick") employee.leaveBalance.sick -= leave.days;
      if (leave.type === "casual") employee.leaveBalance.casual -= leave.days;
      await employee.save();
    }
  } else {
    leave.status = "admin_rejected";
  }

  await leave.save();

  notify(leave.employee, {
    title: "Leave Final Decision",
    message:
      decision === "approve"
        ? "Admin approved your leave"
        : "Admin rejected your leave"
  });

  return success(res, "Admin decision processed", leave);
});
