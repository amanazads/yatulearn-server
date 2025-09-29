import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server is working",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
