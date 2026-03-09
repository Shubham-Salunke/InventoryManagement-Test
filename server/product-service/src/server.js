const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/connectDB");
const errorMiddleware = require("./middlewares/error.middleware");
const categoryRoutes = require("./routes/category.routes");

require("dotenv").config();

const productRoutes = require("./routes/product.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   console.log(`[PRODUCT SERVICE] ${req.method} ${req.originalUrl}`);
//   next();
// });

// Routes
app.use("/products/product", productRoutes);
app.use("/products/categories", categoryRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
  connectDB();
});
// app.use((req, res, next) => {
//   console.log(`[PRODUCT SERVICE] ${req.method} ${req.originalUrl}`);
//   next();
// });

// Routes
app.use("/products/product", productRoutes);
app.use("/products/categories", categoryRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
  connectDB();
});
