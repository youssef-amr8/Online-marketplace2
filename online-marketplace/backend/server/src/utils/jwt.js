const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secretkey'; // replace in production

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
