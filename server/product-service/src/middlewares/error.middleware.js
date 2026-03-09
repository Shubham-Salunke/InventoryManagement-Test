const ApiError = require("../utils/ApiError");

module.exports = (err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};





