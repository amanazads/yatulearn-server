import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

// Razorpay instance
export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// Middlewares
app.use(express.json());

// ✅ Safe CORS: allow only whitelisted origins and support credentials
const allowedOrigins = [
  "https://www.yatulearn.fun",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true, // allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Static uploads
app.use("/uploads", express.static("uploads"));

// Routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import roadmapRoutes from "./routes/roadmap.js";

app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roadmap", roadmapRoutes);

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
