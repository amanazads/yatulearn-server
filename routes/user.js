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
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset/:token", resetPassword);

// Gmail test route
router.get("/test-gmail", async (req, res) => {
  try {
    console.log("🔍 Testing Gmail configuration...");
    console.log("📧 Gmail:", process.env.Gmail);
    console.log("🔑 Password exists:", !!process.env.Password);
    console.log("🔑 Password length:", process.env.Password?.length || 0);

    const configs = [
      {
        name: "Service Gmail",
        config: { service: 'gmail', auth: { user: process.env.Gmail, pass: process.env.Password } }
      },
      {
        name: "SMTP 587",
        config: { host: "smtp.gmail.com", port: 587, secure: false, auth: { user: process.env.Gmail, pass: process.env.Password } }
      },
      {
        name: "SMTP 465", 
        config: { host: "smtp.gmail.com", port: 465, secure: true, auth: { user: process.env.Gmail, pass: process.env.Password } }
      }
    ];

    const results = [];

    for (const { name, config } of configs) {
      try {
        console.log(`🔄 Testing ${name}...`);
        const transporter = nodemailer.createTransporter(config);
        await transporter.verify();
        results.push({ config: name, status: "✅ SUCCESS" });
        console.log(`✅ ${name} - SUCCESS`);
      } catch (error) {
        results.push({ config: name, status: `❌ FAILED: ${error.message}` });
        console.log(`❌ ${name} - FAILED:`, error.message);
      }
    }

    res.json({
      gmail: process.env.Gmail,
      passwordLength: process.env.Password?.length || 0,
      tests: results
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
