import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfToText from "react-pdftotext";

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

export const extractResumeDetails = async (input, type) => {
  try {
    let dataToProcess = "";
    if (type !== "pdf") {
      dataToProcess = input;
      const result = await simulateApiCall(dataToProcess, type);
      return result;
    } else {
      const text = await pdfToText(input);
      console.log(text);
      const dataToProcess = text;
      const result = await simulateApiCall(dataToProcess, type);
      return result;
    }
  } catch (error) {
    console.error("Import failed:", error);
    alert("Failed to import data. Check the console for details.");
  }
};

const summaryPrompt = `
Given the following information from a LinkedIn profile or resume:
{information}
Don't show any other information. If scraping is not possible, return some sample data.
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

// Helper function to simulate API calls (for demonstration purposes)
const simulateApiCall = async (data, type) => {
  if (type === "linkedin" && !data.startsWith("https://www.linkedin.com/in/")) {
    throw new Error(
      "Invalid LinkedIn URL.  For the demo, please use a real-looking LinkedIn profile URL."
    );
  }

  if (type === "pdf" && data.length < 100) {
    throw new Error(
      "Invalid PDF data. For the demo, upload a PDF with substantial text."
    );
  }

  const promptConfig = [{ text: summaryPrompt.replace("{information}", data) }];

  const result = await geminiModel.generateContent({
    contents: [{ role: "user", parts: promptConfig }],
  });
  const response = await result.response;
  const dataText = await response.text();
  console.log("Response from Gemini:", dataText);
  const jsonString = dataText
    .replace("```json\n", "")
    .replace("\n```", "")
    .trim();
  return JSON.parse(jsonString);
};
