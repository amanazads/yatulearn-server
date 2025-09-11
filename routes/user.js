import express from "express";
import {
  forgotPassword,
  loginUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { addProgress, getYourProgress } from "../controllers/course.js";

const router = express.Router();

// ✅ Auth
router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);

// ✅ Password
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

// ✅ Course progress (user-specific)
router.post("/progress", isAuth, addProgress);
router.get("/progress", isAuth, getYourProgress);

export default router;
