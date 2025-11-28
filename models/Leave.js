const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["paid", "sick", "casual", "maternity", "paternity"],
      default: "paid"
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    days: { type: Number, required: true },

    reason: { type: String },

    status: {
      type: String,
      enum: [
        "pending",
        "manager_approved",
        "manager_rejected",
        "admin_approved",
        "admin_rejected"
      ],
      default: "pending"
    },

    manager: { type: Schema.Types.ObjectId, ref: "User" },

    admin: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
