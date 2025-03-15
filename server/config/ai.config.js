const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = {
  genAI
}; 