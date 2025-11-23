import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  try {
    console.log("🚀 Registration started");
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User Already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create activation token
    const activationToken = jwt.sign(
      { name, email, password: hashPassword, otp },
      process.env.Activation_Secret,
      { expiresIn: "5m" }
    );

    console.log(`📧 Sending OTP ${otp} to ${email}`);

    // Send response immediately (don't wait for email)
    res.status(200).json({
      message: "OTP sent to your email! Please check your inbox and spam folder.",
      activationToken,
    });

    // Send email asynchronously (non-blocking)
    sendMail(email, "YATU Learn - Verify Your Email Address", { name, otp })
      .then(() => {
        console.log("✅ Email sent successfully to inbox");
      })
      .catch((emailError) => {
        console.error("❌ Email sending failed:", emailError.message);
      });

  } catch (error) {
    console.error("💥 Registration error:", error);
    res.status(500).json({
      message: "Internal server error during registration",
      error: error.message
    });
  }
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  console.log("🔍 Verification request:", { otp, hasToken: !!activationToken });

  if (!otp || !activationToken) {
    return res.status(400).json({
      message: "Please provide OTP and activation token",
    });
  }

  try {
    const verify = jwt.verify(activationToken, process.env.Activation_Secret);
    console.log("✅ Token verified, comparing OTP:", verify.otp, "vs", parseInt(otp));

    if (verify.otp !== parseInt(otp)) {
      return res.status(400).json({
        message: "Wrong OTP",
      });
    }

    console.log("👤 Creating user in database");
    await User.create({
      name: verify.name,
      email: verify.email,
      password: verify.password,
    });

    console.log("✅ User created successfully");

    res.json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.error("💥 Verification error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        message: "OTP expired. Please register again.",
      });
    }
    
    res.status(400).json({
      message: "Invalid OTP or token",
    });
  }
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "No User with this email",
    });
  }

  const mathPassword = await bcrypt.compare(password, user.password);

  if (!mathPassword) {
    return res.status(400).json({
      message: "Wrong Password",
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json({
    user,
  });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "No User with this email",
    });
  }

  const token = jwt.sign({ email }, process.env.Forgot_Secret, {
    expiresIn: "5m",
  });

  const data = { email, token };

  await sendMail(email, "YATU Learn Password Reset", data);

  res.json({
    message: "Password reset link sent to your email",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const decodedData = jwt.verify(token, process.env.Forgot_Secret);

  const user = await User.findOne({ email: decodedData.email });

  if (!user) {
    return res.status(404).json({
      message: "No user with this email",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user.password = hashPassword;

  await user.save();

  res.json({
    message: "Password Reset Successfully",
  });
});
