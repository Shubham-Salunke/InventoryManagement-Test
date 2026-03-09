// src/services/auth.service.js
const crypto = require("crypto");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { hashPassword, comparePassword } = require("../utils/password");
const { sendInviteEmail } = require("../email/email.service");

exports.inviteUser = async (data, invitedBy) => {
  const { name, email, role } = data;

  if (invitedBy.role === "MANAGER" && role !== "STAFF") {
    throw new ApiError(403, "Manager can invite STAFF only");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "User already exists");
  }

  const inviteToken = crypto.randomBytes(32).toString("hex");
    
  await User.create({
    name,
    email,
    role,
    inviteToken,
    inviteExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  // 🔔 Emit event to Notification Service
  
  await sendInviteEmail({
    to: email,
    name,
    inviteToken,
  });

  return { message: "Invitation sent successfully" };
};

exports.setPassword = async (token, password) => {
  const user = await User.findOne({
    inviteToken: token,
    inviteExpiresAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired invitation token");
  }

  user.password = await hashPassword(password);
  user.status = "ACTIVE";
  user.inviteToken = null;
  user.inviteExpiresAt = null;

  await user.save();
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email, status: "ACTIVE" });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  return user;
};
