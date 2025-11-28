const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policySchema = new Schema(
  {
    title: { type: String, required: true },

    description: { type: String },

    quota: {
      type: Object,
      default: {}
      /* Example:
        {
          paid: 12,
          sick: 8,
          casual: 5
        }
      */
    },

    effectiveFrom: { type: Date },

    effectiveTo: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Policy", policySchema);
