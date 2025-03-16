import { genAI } from '../config/ai.config.js';
import { parseGeneratedCode } from '../utils/codeParser.js';

const generateCode = async (req, res) => {
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
};

export { generateCode }; 