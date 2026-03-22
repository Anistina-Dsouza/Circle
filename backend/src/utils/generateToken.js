const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '3650d' } // Extended to 10 years to prevent session timeouts
  );
};

module.exports = generateToken;
