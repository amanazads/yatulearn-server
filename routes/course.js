import express from "express";
import {
  getAllCourses,
  getSingleCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  paymentVerification,
} from "../controllers/course.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

// ✅ Cleaned routes
router.get("/all", getAllCourses); 
router.get("/:id", getSingleCourse);
router.get("/lectures/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);
router.get("/mycourse", isAuth, getMyCourses);
router.post("/checkout/:id", isAuth, checkout);
router.post("/verification/:id", isAuth, paymentVerification);

export default router;
