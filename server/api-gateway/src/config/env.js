require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,

  SERVICES: {
    AUTH: process.env.AUTH_SERVICE_URL,
    PRODUCT: process.env.PRODUCT_SERVICE_URL,
  },
};
