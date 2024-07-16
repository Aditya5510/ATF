const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("dotenv");
env.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "What is the meaning of life?in 2 lines only";

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
  } catch (error) {
    console.error("Error generating text:", error);
  }
}

module.exports = run;
