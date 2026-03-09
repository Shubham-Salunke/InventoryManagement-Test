const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({
  email: String,
  role: {
    type: String,
    enum: ["manager", "staff"]
  },
  token: String,
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: Date
});

module.exports = mongoose.model("Invite", inviteSchema);
