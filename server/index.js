const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const promptTemplate = `Create a modern website using only HTML, CSS, and JavaScript based on this description: ${prompt}

    Provide three separate files with complete code. Make sure to include proper structure, styling, and interactivity.

    First, provide the HTML file:
    \`\`\`html
    // Complete index.html code here with proper structure
    \`\`\`

    Next, provide the CSS file:
    \`\`\`css
    // Complete styles.css code here with modern styling
    \`\`\`

    Finally, provide the JavaScript file:
    \`\`\`javascript
    // Complete script.js code here with all functionality
    \`\`\`

    Ensure each file is complete and can work together.`;

    const result = await model.generateContent(promptTemplate);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No content generated');
    }

    const files = parseGeneratedCode(text);

    // Validate that all required files are present
    const requiredFiles = ['index.html', 'styles.css', 'script.js'];
    const missingFiles = requiredFiles.filter(file => !files[file]);
    
    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
    }

    console.log('Generated files:', Object.keys(files));

    res.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate code'
    });
  }
});

function parseGeneratedCode(text) {
  const files = {};
  const fileRegex = /```(html|css|javascript)([\s\S]*?)```/g;
  let match;

  const fileMapping = {
    'html': 'index.html',
    'css': 'styles.css',
    'javascript': 'script.js'
  };

  while ((match = fileRegex.exec(text)) !== null) {
    const extension = match[1].toLowerCase();
    const content = match[2].trim();
    const fileName = fileMapping[extension];
    
    if (fileName) {
      files[fileName] = content;
    }
  }

  return files;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});