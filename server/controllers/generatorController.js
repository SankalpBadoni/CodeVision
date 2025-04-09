import { genAI } from '../config/ai.config.js';
import { parseGeneratedCode } from '../utils/codeParser.js';

const generateCode = async (req, res) => {
  try {
    const { prompt, selectedFile, currentFiles } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let promptTemplate;
    
    // Check if this is an initial generation or a modification
    if (!currentFiles || Object.values(currentFiles).every(file => !file.trim())) {
      // Initial website generation - create all files
      // [existing initial generation code remains unchanged]
      promptTemplate = `Create a modern website using only HTML, CSS, and JavaScript based on this description: ${prompt}

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

      // Check for required files
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
      
    } else {
      // This is a modification request
      // First, ask AI if multiple files need to be updated
      const analysisPrompt = `
      I have a web project with the following files:
      
      HTML (index.html):
      \`\`\`html
      ${currentFiles['index.html'] || '// Empty file'}
      \`\`\`
      
      CSS (styles.css):
      \`\`\`css
      ${currentFiles['styles.css'] || '// Empty file'}
      \`\`\`
      
      JavaScript (script.js):
      \`\`\`javascript
      ${currentFiles['script.js'] || '// Empty file'}
      \`\`\`
      
      User request: "${prompt}"
      
      Which files need to be modified to implement this request? 
      Respond with just the filenames separated by commas (e.g., "index.html,styles.css" or "styles.css").
      If the request can be implemented by changing just the currently selected file (${selectedFile}), 
      respond with just that filename.
      `;
      
      const analysisResult = await model.generateContent(analysisPrompt);
      const analysisResponse = await analysisResult.response;
      const analysisText = analysisResponse.text().trim();
      
      // Parse the files that need to be updated
      const filesToUpdate = analysisText.split(',').map(file => file.trim());
      
      // If the AI suggests files that aren't in our set, default to the selected file
      const validFiles = filesToUpdate.filter(file => 
        ['index.html', 'styles.css', 'script.js'].includes(file)
      );
      
      const filesToActuallyUpdate = validFiles.length > 0 ? validFiles : [selectedFile];
      
      console.log(`Files to update based on AI analysis: ${filesToActuallyUpdate.join(', ')}`);

      if (filesToActuallyUpdate.length === 1 && filesToActuallyUpdate[0] === selectedFile) {
        // Single file update - use the existing logic
        const fileExtension = selectedFile.split('.').pop();
        const fileType = {
          'html': 'HTML',
          'css': 'CSS',
          'js': 'JavaScript'
        }[fileExtension] || 'code';
        
        promptTemplate = `I have a web project with the following files:
        
        HTML (index.html):
        \`\`\`html
        ${currentFiles['index.html'] || '// Empty file'}
        \`\`\`
        
        CSS (styles.css):
        \`\`\`css
        ${currentFiles['styles.css'] || '// Empty file'}
        \`\`\`
        
        JavaScript (script.js):
        \`\`\`javascript
        ${currentFiles['script.js'] || '// Empty file'}
        \`\`\`
        
        User request: "${prompt}"
        
        Please modify ONLY the ${fileType} file (${selectedFile}) to implement this request.
        Return ONLY the complete updated content for ${selectedFile} file.
        
        \`\`\`${fileExtension}
        // Your updated ${selectedFile} code here
        \`\`\`
        `;
        
        const result = await model.generateContent(promptTemplate);
        const response = await result.response;
        const text = response.text();
        
        if (!text) {
          throw new Error('No content generated');
        }
        
        // Extract the file content from the response
        const codeRegex = new RegExp('```' + fileExtension + '([\\s\\S]*?)```');
        const matches = text.match(codeRegex);
        
        if (!matches || !matches[1]) {
          throw new Error(`Failed to extract updated ${selectedFile} content`);
        }
        
        const updatedContent = matches[1].trim();
        
        console.log(`Updated ${selectedFile} successfully`);
        
        res.json({
          success: true,
          fileContent: updatedContent,
          updatedFiles: [selectedFile]
        });
      } else {
        // Multiple files update - generate updates for each file
        promptTemplate = `I have a web project with the following files:
        
        HTML (index.html):
        \`\`\`html
        ${currentFiles['index.html'] || '// Empty file'}
        \`\`\`
        
        CSS (styles.css):
        \`\`\`css
        ${currentFiles['styles.css'] || '// Empty file'}
        \`\`\`
        
        JavaScript (script.js):
        \`\`\`javascript
        ${currentFiles['script.js'] || '// Empty file'}
        \`\`\`
        
        User request: "${prompt}"
        
        Based on analysis, I need to update the following files: ${filesToActuallyUpdate.join(', ')}
        
        Please provide the complete updated content for EACH of these files.
        For each file, use the format:
        
        \`\`\`filename:FILENAME
        // Complete updated content for FILENAME
        \`\`\`
        
        Replace FILENAME with the actual filename (e.g., index.html, styles.css, or script.js).
        Provide ALL the necessary code for each file, not just the changes.
        `;
        
        const result = await model.generateContent(promptTemplate);
        const response = await result.response;
        const text = response.text();
        
        if (!text) {
          throw new Error('No content generated');
        }
        
        // Extract updates for each file
        const updatedFiles = {};
        let updatedFilesList = [];
        
        for (const filename of filesToActuallyUpdate) {
          const fileRegex = new RegExp('```filename:' + filename + '([\\s\\S]*?)```');
          const matches = text.match(fileRegex);
          
          if (matches && matches[1]) {
            updatedFiles[filename] = matches[1].trim();
            updatedFilesList.push(filename);
            console.log(`Updated ${filename} successfully`);
          }
        }
        
        if (Object.keys(updatedFiles).length === 0) {
          throw new Error('Failed to extract updated content for any files');
        }
        
        // If we managed to update the selected file, return it as fileContent for backwards compatibility
        const fileContent = updatedFiles[selectedFile] || '';
        
        res.json({
          success: true,
          fileContent, // For backward compatibility with single file updates
          multiFileUpdate: true,
          updatedFiles: updatedFiles,
          updatedFilesList
        });
      }
    }

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate code'
    });
  }
};

export { generateCode };