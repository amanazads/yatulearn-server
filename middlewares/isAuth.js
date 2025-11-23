import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    // Try common locations for a token
    let token = req.headers.authorization || req.headers.Authorization;

    // If no Authorization header, try x-access-token
    if (!token) token = req.headers['x-access-token'];

    // If still no token, attempt to parse from cookie header (simple parse, no dependency)
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      for (const c of cookies) {
        if (c.startsWith('token=')) {
          token = c.split('=')[1];
          break;
        }
      }
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided. Please login." });
    }

    // Handle both "Bearer token" and direct token formats
    const actualToken = typeof token === 'string' && token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    if (!process.env.Jwt_Sec) {
      console.error('Jwt_Sec is not set in environment variables');
      return res.status(500).json({ message: 'Server misconfiguration: missing JWT secret' });
    }

    let decodedData;
    try {
      decodedData = jwt.verify(actualToken, process.env.Jwt_Sec);
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }

    req.user = await User.findById(decodedData._id);

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('isAuth middleware error:', error.message);
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not admin",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};