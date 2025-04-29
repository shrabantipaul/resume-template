const { GoogleGenerativeAI } = require("@google-generative-ai");
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

const upload = multer({ storage: multer.memoryStorage() }); // Initialize multer

exports.handler = async (event, context) => {
  try {
    // 1. Parse the form data from the event
    const boundary = event.headers['content-type'].split('boundary=')[1];
    const body = event.body;

    // 2. Extract the file buffer
    const fileContent = extractFileFromMultipart(body, boundary);
    if (!fileContent) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "PDF file is required" }),
        };
    }
    const pdfData = await pdfParse(fileContent);
    const text = pdfData.text;

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

    const promptConfig = [{ text: summaryPrompt.replace("{information}", text) }];
    const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: promptConfig }],
    });
    const response = await result.response;

    return {
        statusCode: 200,
        body: JSON.stringify(response.text()),
    };
} catch (error) {
    console.error("PDF scrape error:", error);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to scrape PDF" }),
    };
}
}