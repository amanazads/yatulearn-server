import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";
import { isAuth } from "./middlewares/isAuth.js";
import {
  register,
  loginUser,
  myProfile,
} from "./controllers/user.js";
import { getMyCourses } from "./controllers/course.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// Configure CORS to allow custom token header and credentials
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token", "x-access-token"],
    exposedHeaders: ["Authorization", "token"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

const port = process.env.PORT || 8080;

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

// Short fallback routes to support clients that call legacy endpoints without `/api` or `/user` prefix
app.post("/register", register);
app.post("/login", loginUser);
app.get("/me", isAuth, myProfile);
app.get("/mycourse", isAuth, getMyCourses);

app.get("/", (req, res) => {
  res.json({
    message: "Server is working",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
