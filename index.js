import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// --- START OF FIX ---
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL].filter(Boolean)
        : ["http://localhost:3000", "http://localhost:5173"];

    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));

app.use(express.json());
// --- END OF FIX ---

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  connectDb();
});
