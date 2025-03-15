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

module.exports = {
  parseGeneratedCode
}; 