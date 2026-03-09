// src/controllers/auth.controller.js
const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/token");

exports.inviteUser = asyncHandler(async (req, res) => {
  const result = await authService.inviteUser(req.body, req.user);
  res.status(201).json({ success: true, ...result });
});

exports.setPassword = asyncHandler(async (req, res) => {
 
  const { token, password } = req.body;
    if (!token || !password) {
    throw new ApiError(400, "Token and password are required");
  }
  await authService.setPassword(token, password);

  res.json({ success: true, message: "Password set successfully" });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await authService.login(email, password);
  const token = generateToken(user);
 
  res.cookie("accessToken", token, {
    httpOnly: true, // ❗ cannot be accessed by JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax", // CSRF protection
    maxAge:30* 60 * 1000, // 15 minutes
  });
  res.json({
    success: true,
    user,
  });
});

exports.me = asyncHandler(async (req, res) => {
  // req.user comes from auth.middleware
  res.json({
    success: true,
    user: {
      id: req.user.userId,
      role: req.user.role,
    },
  });
});


exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.json({ success: true, message: "Logged out successfully" });
});
