// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // support multiple claim names just in case
    const userId = decoded.userId || decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ message: 'Token missing user id' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // attach user doc for downstream handlers
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
  }
});

/**
 * authorize(...roles)
 * roles = strings like 'STUDENT', 'ORGANIZER', 'ADMIN'
 */
export const authorize = (...roles) => {
  // normalize roles to uppercase to match your User.role enum
  const allowed = roles.map(r => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Not authorized (no role)' });
    }
    if (!allowed.includes(req.user.role.toUpperCase())) {
      return res.status(403).json({ message: `Role '${req.user.role}' not authorized` });
    }
    next();
  };
};
