const jwt = require('jsonwebtoken');
const User = require('./book1');
require('dotenv').config();

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal user info
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token: user not found' });
    req.user = user; // full user doc without password
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = auth;

