const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/token");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ApiError(401, "Authentication token missing");
    }

    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
