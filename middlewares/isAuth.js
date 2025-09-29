import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(403).json({
        message: "Please Login",
      });
    }

    // Handle both "Bearer token" and direct token formats
    const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    const decodedData = jwt.verify(actualToken, process.env.Jwt_Sec);

    req.user = await User.findById(decodedData._id);
    
    if (!req.user) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    res.status(403).json({
      message: "Please Login",
    });
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