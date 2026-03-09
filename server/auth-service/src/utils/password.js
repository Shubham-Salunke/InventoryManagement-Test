const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12; 

/**
 * Hash plain password
 */
exports.hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare password
 */
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
