import express from "express";
import { OpenAI } from "openai";

const router = express.Router();

router.post("/", async (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ message: "Skill is required" });

  try {
    const client = new OpenAI({
      apiKey: process.env.HF_TOKEN, // HF token from .env
      baseURL: "https://router.huggingface.co/v1",
    });

    const chatCompletion = await client.chat.completions.create({
      model: "Qwen/Qwen3-Coder-480B-A35B-Instruct:cerebras",
      messages: [
        {
          role: "user",
          content: `Generate a clean roadmap for learning ${skill}. 
Return 5-10 numbered steps. Include at least one platform or website for each step like Coursera, Udemy, YouTube, freeCodeCamp, or official docs.
Return the result as simple text, no stars or markdown.`
        }
      ]
    });

    const text = chatCompletion.choices[0].message.content;

    // Split into steps
    const steps = text
      .split(/\n+/)
      .map(step => step.replace(/^\d+\.\s*/, "").trim())
      .filter(step => step.length > 0);

    // Map to structured JSON with platform links
    const roadmap = steps.map(step => ({
      step,
      platform: getPlatform(step),
      platformLink: getPlatformLink(step)
    }));

    res.json({ roadmap });
  } catch (error) {
    console.error("Roadmap API error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error generating roadmap",
      error: error.response?.data || error.message
    });
  }
});

// Helper to assign a platform name
function getPlatform(step) {
  const lower = step.toLowerCase();
  if (lower.includes("coursera")) return "Coursera";
  if (lower.includes("udemy")) return "Udemy";
  if (lower.includes("youtube")) return "YouTube";
  if (lower.includes("freecodecamp")) return "freeCodeCamp";
  if (lower.includes("documentation") || lower.includes("docs")) return "MDN Docs";
  return "Search Online";
}

// Helper to assign a platform link
function getPlatformLink(step) {
  const lower = step.toLowerCase();
  if (lower.includes("coursera")) return "https://www.coursera.org";
  if (lower.includes("udemy")) return "https://www.udemy.com";
  if (lower.includes("youtube")) return "https://www.youtube.com";
  if (lower.includes("freecodecamp")) return "https://www.freecodecamp.org";
  if (lower.includes("documentation") || lower.includes("docs")) return "https://developer.mozilla.org";
  return "https://www.google.com/search?q=" + encodeURIComponent(step);
}

export default router;
``
