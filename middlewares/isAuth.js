import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token; // You can also support Authorization: Bearer

    if (!token) {
      return res.status(403).json({ message: "Please login" });
    }

    const decodedData = jwt.verify(token, process.env.Jwt_Sec);
    req.user = await User.findById(decodedData._id);

    if (!req.user) {
      return res.status(401).json({ message: "Invalid token or user not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "You are not an admin" });
  }
  next();
};
