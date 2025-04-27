const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const upload = multer({ storage: multer.memoryStorage() });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;;

const googleAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const geminiConfig = {
  temperature: 0.4,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  geminiConfig,
});

const app = express();
app.use(cors());
app.use(express.json());

const summaryPrompt = `
Given the following information from a LinkedIn profile or resume:
{information}

Extract and structure the data into the following JSON format:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": ""
  },
  "sections": [
    {
      "id": "summary",
      "title": "Summary",
      "type": "text",
      "content": ""
    },
    {
      "id": "work-experience",
      "title": "Work Experience",
      "type": "list",
      "items": [
        {
          "id": 1,
          "fields": {
            "company": "",
            "position": "",
            "duration": "",
            "description": ""
          }
        }
      ]
    },
    {
      "id": "skills",
      "title": "Skills",
      "type": "text",
      "content": ""
    }
  ]
}
`;

// Scrape LinkedIn profile
app.post("/scrape-linkedin", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url)
      return res.status(400).json({ error: "LinkedIn URL is required" });

    const promptConfig = [
      { text: summaryPrompt.replace("{information}", url) },
    ];

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });
    const response = await result.response;
    res.json(response.text());
  } catch (error) {
    console.error("LinkedIn scrape error:", error);
    res.status(500).json({ error: "Failed to scrape LinkedIn profile" });
  }
});

// Scrape PDF resume
app.post("/scrape-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "PDF file is required" });

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;
    const promptConfig = [
      { text: summaryPrompt.replace("{information}", text) },
    ];
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: promptConfig }],
    });
    const response = await result.response;
    res.json(response.text());
  } catch (error) {
    console.error("PDF scrape error:", error);
    res.status(500).json({ error: "Failed to scrape PDF" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
