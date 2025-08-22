import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ai
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// cors
app.use(
  cors({
    origin: "http://localhost:5173", // your React dev server
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/ask", async (req, res) => {
  try {
    const { Question } = req.body;

    // Add prompt instructions
    const finalPrompt = `Answer in simple, concise words (max 3-4 sentences) but if it's specified in question like long answer, explain or certain words only then you can give big answers. 
Question: ${Question}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
    });

    const myAns =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    res.json({ success: true, answer: myAns });
  } catch (err) {
    console.error("Error in /ask:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
