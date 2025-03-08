import { useState } from 'react'
import Editor from '@monaco-editor/react'

const Generator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState('index.html')
  const [code, setCode] = useState(dummyFiles['index.html'])

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

  return (
    <div className="flex h-screen pt-16">
      {/* Left Side - Steps */}
      <div className="w-72 border-r border-gray-800 bg-gray-900/50">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
            Generation Progress
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index !== steps.length - 1 && (
                  <div className={`absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+32px)] 
                    ${index < currentStep ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
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
                    <h3 className={`font-medium ${index === currentStep ? 'text-indigo-400' : 'text-gray-300'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
            className="w-full py-3 mt-8 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Deploy Website' : 'Next Step'}
          </button>
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
          <div className="space-y-4">
            {Object.entries(fileStructure).map(([folder, files]) => (
              <div key={folder} className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 text-gray-300 p-2 bg-gray-800/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="text-sm font-medium">{folder}</span>
                </div>
                <div className="p-2 space-y-1">
                  {files.map(file => (
                    <button
                      key={file}
                      onClick={() => {
                        setSelectedFile(file)
                        setCode(dummyFiles[file])
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
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Code Editor */}
      <div className="flex-1 bg-gray-900">
        <div className="h-full">
          <Editor
            height="100%"
            defaultLanguage={getFileLanguage(selectedFile)}
            theme="vs-dark"
            value={code}
            onChange={setCode}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 20 },
            }}
          />
        </div>
      </div>
    </div>
  )
}

const fileStructure = {
  'src': ['index.html', 'styles.css', 'main.js'],
  'components': ['Header.jsx', 'Hero.jsx', 'Features.jsx'],
  'assets': ['logo.svg', 'hero-image.png']
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

const getFileLanguage = (filename) => {
  const ext = filename.split('.').pop()
  const languages = {
    html: 'html',
    css: 'css',
    js: 'javascript',
    jsx: 'javascript',
    svg: 'xml',
    png: 'plaintext'
  }
  return languages[ext] || 'plaintext'
}

export default Generator 