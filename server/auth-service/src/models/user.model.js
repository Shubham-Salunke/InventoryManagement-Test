// src/models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: { type: String },

    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "STAFF"],
      required: true,
    },

    status: {
      type: String,
      enum: ["INVITED", "ACTIVE"],
      default: "INVITED",
    },

    inviteToken: String,
    inviteExpiresAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
