import dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config();

console.log("🔍 Testing Email Configuration...\n");

// Check environment variables
console.log("Environment Variables:");
console.log("✓ Gmail:", process.env.Gmail || "❌ NOT SET");
console.log("✓ Password:", process.env.Password ? "✓ SET (hidden)" : "❌ NOT SET");
console.log("✓ Password length:", process.env.Password?.length || 0, "characters\n");

if (!process.env.Gmail || !process.env.Password) {
  console.error("❌ ERROR: Gmail or Password not set in .env file");
  process.exit(1);
}

// Test SMTP connection
async function testEmail() {
  try {
    console.log("📧 Creating SMTP transport...");
    const transport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.Gmail,
        pass: process.env.Password,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    console.log("🔌 Verifying connection to Gmail SMTP...");
    await transport.verify();
    console.log("✅ SUCCESS: SMTP connection verified!\n");

    // Send test email
    console.log("📨 Sending test email...");
    const info = await transport.sendMail({
      from: process.env.Gmail,
      to: process.env.Gmail, // Send to yourself
      subject: "YATU Learn - Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h1 style="color: #7b68ee;">✅ Email Configuration Working!</h1>
          <p>Your YATU Learn server can now send emails successfully.</p>
          <p>Test completed at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ SUCCESS: Test email sent!");
    console.log("📬 Message ID:", info.messageId);
    console.log("\n✨ Email configuration is working correctly!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    
    if (error.message.includes("Invalid login")) {
      console.error("\n🔧 SOLUTION:");
      console.error("Your Gmail password is incorrect or you're not using an App Password.");
      console.error("\nSteps to fix:");
      console.error("1. Go to https://myaccount.google.com/apppasswords");
      console.error("2. Generate a new App Password");
      console.error("3. Update the Password in your .env file");
    } else if (error.message.includes("ECONNECTION") || error.message.includes("ETIMEDOUT")) {
      console.error("\n🔧 SOLUTION:");
      console.error("Connection to Gmail SMTP failed. Check your internet connection.");
    }
    
    process.exit(1);
  }
}

testEmail();
