// gen.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

function initializeGenAI(apiKey) {
  return new GoogleGenerativeAI(apiKey);
}

async function performATSCalculation(genAI, jobDescription, resume) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an ATS (Applicant Tracking System) analyzer. Your task is to evaluate a resume against a job description and provide a score out of 100, along with a brief explanation.

    Job Description:
    ${jobDescription}

    Resume:
    ${resume}

    Please analyze the resume against the job description and provide:
    1. A score out of 100
    2. A brief explanation for the score (maximum 100 words)

    Format your response as JSON without any markdown formatting:
    {
      "score": [score],
      "explanation": "[explanation]"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove any markdown formatting
    const cleanedText = text.replace(/```json\n|\n```/g, "").trim();

    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanedText);

    return {
      score: parsedResponse.score,
      explanation: parsedResponse.explanation,
    };
  } catch (error) {
    console.error("Error in ATS calculation:", error);
    console.error("Raw response:", error.response?.text());
    throw new Error("Failed to perform ATS calculation");
  }
}

module.exports = { initializeGenAI, performATSCalculation };
