const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const promptTemplate = `Create a modern website based on this description: ${prompt}
    Please provide the following files:
    1. index.html
    2. styles.css with Tailwind CSS
    3. main.js with React
    4. Essential React components

    Provide clean, modern, and responsive code.`;

    const result = await model.generateContent(promptTemplate);
    const response = await result.response;
    const text = response.text();

    const files = parseGeneratedCode(text);

    res.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate code'
    });
  }
});

function parseGeneratedCode(text) {
  const files = {};
  const fileRegex = /```(\w+|jsx|html|css)([\s\S]*?)```/g;
  let match;

  while ((match = fileRegex.exec(text)) !== null) {
    const extension = match[1];
    const content = match[2].trim();
    
    // Map file extensions to file names
    const fileName = getFileName(extension);
    if (fileName) {
      files[fileName] = content;
    }
  }

  return files;
}

function getFileName(extension) {
  const mapping = {
    html: 'index.html',
    css: 'styles.css',
    js: 'main.js',
    jsx: 'App.jsx',
  };
  return mapping[extension];
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});