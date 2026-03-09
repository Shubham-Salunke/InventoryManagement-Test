const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.accessToken;

    if (!token) {
      throw new ApiError(401, "Authentication token missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

