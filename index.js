import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";

// routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import roadmapRoutes from "./routes/roadmap.js";

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["https://www.yatulearn.fun", "http://localhost:5173"],
    credentials: true,
  })
);

const port = process.env.PORT || 8080;

// ✅ test route
app.get("/api/check", (req, res) => {
  res.send("API is working");
});

// ✅ use routes
app.use("/api/user", userRoutes); // 🔧 mount at /api/user
app.use("/api/course", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roadmap", roadmapRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDb();
});
