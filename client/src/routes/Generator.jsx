import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'

const Generator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState('index.html')
  const [files, setFiles] = useState({})
  const [code, setCode] = useState('')
  const [isAddingDetails, setIsAddingDetails] = useState(false)
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    // Load generated files from localStorage
    const generatedFiles = localStorage.getItem('generatedFiles');
    if (generatedFiles) {
      const parsedFiles = JSON.parse(generatedFiles);
      setFiles(parsedFiles);
      setCode(parsedFiles[selectedFile] || '');
    }
  }, [selectedFile]);

  // Auto progress through steps
  useEffect(() => {
    const stepDurations = [1000, 1000, 1000, 0]; // Duration for each step in milliseconds
    
    if (currentStep <= steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, stepDurations[currentStep]);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const steps = [
    {
      title: "Analyzing Requirements",
      description: "AI is processing your requirements and planning the website structure",
      status: "current"
    },
    {
      title: "Generating Code",
      description: "Creating optimized code based on your specifications",
      status: "upcoming"
    },
    {
      title: "Styling & Design",
      description: "Implementing responsive design and visual elements",
      status: "upcoming"
    },
    {
      title: "Final Touches",
      description: "Adding interactivity and optimizing performance",
      status: "upcoming"
    }
  ]

  const fileStructure = {
    'src': ['index.html', 'styles.css', 'script.js']
  };

  const getFileLanguage = (filename) => {
    const ext = filename.split('.').pop()
    const languages = {
      html: 'html',
      css: 'css',
      js: 'javascript'
    }
    return languages[ext] || 'plaintext'
  }

  // Progress bar calculation
  const progressPercentage = ((currentStep ) / steps.length) * 100;

  const handleRegenerateCode = async () => {
    try {
      setIsRegenerating(true);
      setCurrentStep(0); // Reset progress

      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: additionalDetails,
          existingFiles: files // Send existing files for context
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('generatedFiles', JSON.stringify(data.files));
        setFiles(data.files);
        setCode(data.files[selectedFile] || '');
        setIsAddingDetails(false);
        setAdditionalDetails('');
      } else {
        throw new Error(data.error || 'Failed to regenerate code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred while regenerating the code.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="flex h-screen pt-16">
      {/* Left Side - Steps */}
      <div className="w-72 border-r border-gray-800 bg-gray-900/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
              Generation Progress
            </h2>
            <span className="text-sm text-gray-400">{Math.round(progressPercentage)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-gray-700 rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index !== steps.length - 1 && (
                  <div className={`absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+32px)] transition-colors duration-500
                    ${index < currentStep ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500
                    ${index === currentStep ? 'bg-indigo-500 animate-pulse' : 
                      index < currentStep ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                    {index < currentStep ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-white text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium transition-colors duration-500 ${index === currentStep ? 'text-indigo-400' : 'text-gray-300'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </div>

      {/* File Structure */}
      <div className="w-64 border-r border-gray-800 bg-gray-900/50 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Project Files
          </h3>
          <div className="space-y-1">
            {Object.entries(fileStructure).map(([folder, fileList]) => (
              <div key={folder}>
                {fileList.map(file => (
                  <button
                    key={file}
                    onClick={() => {
                      setSelectedFile(file);
                      setCode(files[file] || '');
                    }}
                    className={`flex items-center gap-2 text-sm p-2 rounded-md w-full text-left
                      ${selectedFile === file 
                        ? 'bg-indigo-500/10 text-indigo-400' 
                        : 'text-gray-400 hover:bg-gray-800/50'
                      } transition-colors`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {file}
                  </button>
                ))}
              </div>
            ))}
            {currentStep === steps.length - 1 && (
            <div className="mt-4">
              {!isAddingDetails ? (
                <button 
                  onClick={() => setIsAddingDetails(true)}
                  className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add more details</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-[1px] rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500">
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="Add more details about what you'd like to change or add..."
                      className="w-full p-3 rounded-lg bg-gray-900/90 border-none focus:outline-none text-white placeholder-gray-400 text-sm"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRegenerateCode}
                      disabled={isRegenerating || !additionalDetails.trim()}
                      className={`flex-1 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 
                        hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-lg 
                        flex items-center justify-center gap-2
                        ${(isRegenerating || !additionalDetails.trim()) && 'opacity-50 cursor-not-allowed'}`}
                    >
                      {isRegenerating ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Regenerating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Regenerate</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingDetails(false);
                        setAdditionalDetails('');
                      }}
                      className="py-2 px-4 text-sm font-semibold bg-gray-800 hover:bg-gray-700 
                        transition-all duration-300 rounded-lg text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Right Side - Code Editor */}
      <div className="flex-1 bg-gray-900/95 relative">
        {/* Editor Header */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gray-900/90 border-b border-gray-800 backdrop-blur-sm z-10 flex items-center px-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-400">
              {selectedFile}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {getFileLanguage(selectedFile)}
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Editor Wrapper */}
        <div className="h-full pt-12">
          <Editor
            height="100%"
            defaultLanguage={getFileLanguage(selectedFile)}
            language={getFileLanguage(selectedFile)}
            theme="vs-dark"
            value={files[selectedFile] || ''}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              padding: { top: 20 },
              readOnly: false,
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: true,
              formatOnPaste: true,
              formatOnType: true,
              lineNumbers: "on",
              lineDecorationsWidth: 8,
              lineNumbersMinChars: 3,
              renderLineHighlight: "all",
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: true,
                verticalHasArrows: false,
                horizontalHasArrows: false,
              },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              renderIndentGuides: true,
              contextmenu: true,
              quickSuggestions: true,
              folding: true,
              showFoldingControls: "always",
              foldingHighlight: true,
              showDeprecated: true,
              links: true,
              bracketPairColorization: {
                enabled: true,
              },
            }}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('custom-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                  'editor.background': '#111827',
                  'editor.lineHighlightBackground': '#1f2937',
                  'editorLineNumber.foreground': '#4b5563',
                  'editorLineNumber.activeForeground': '#9ca3af',
                  'editor.selectionBackground': '#374151',
                  'editor.inactiveSelectionBackground': '#374151',
                },
              });
            }}
            onMount={(editor, monaco) => {
              monaco.editor.setTheme('custom-dark');
            }}
          />
        </div>

        {/* Editor Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900/90 border-t border-gray-800 backdrop-blur-sm flex items-center px-4">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Line: {1}</span>
            <span>Column: {1}</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{getFileLanguage(selectedFile).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const dummyFiles = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="root"></div>
    <script src="main.js"></script>
</body>
</html>`,

  'styles.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

.hero {
    @apply min-h-screen flex items-center justify-center;
    background: linear-gradient(to right, #3b82f6, #4f46e5);
}`,

  'main.js': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);`,

  'Header.jsx': `import React from 'react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Logo />
                    <Navigation />
                </div>
            </nav>
        </header>
    );
}`
}

export default Generator 