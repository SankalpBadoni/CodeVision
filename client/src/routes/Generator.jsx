import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Link, useNavigate } from "react-router-dom";
import { Clipboard } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from 'react-redux';
import { createProject, updateProject, fetchProjectById } from '../redux/slices/ProjectSlice.js';

const Generator = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState(() => {
    
    const savedFiles = localStorage.getItem("generatedFiles");
    return savedFiles
      ? JSON.parse(savedFiles)
      : {
          "index.html": "",
          "styles.css": "",
          "script.js": "",
        };
  });
  const [selectedFile, setSelectedFile] = useState("index.html");
  const [messages, setMessages] = useState(() => {
    
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            role: "ai",
            content:
              "I have generated the website based on your requirements. You can view and edit the files in the editor.",
          },
        ];
  });
  const [currentProjectId, setCurrentProjectId] = useState(() => {
    return localStorage.getItem("currentProjectId") || null;
  });
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { currentProject } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  
  const copyFile = () => {
    const fileContent = files[selectedFile];
    navigator.clipboard.writeText(fileContent);
    toast.success("File copied to clipboard");
  };
  
  
  useEffect(() => {
    const savedFiles = localStorage.getItem("generatedFiles");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("generatedFiles", JSON.stringify(files));
    
    
    if (currentProjectId && Object.keys(files).length > 0) {
      const timeoutId = setTimeout(() => {
        saveProjectData(false); 
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [files]);

  
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    
    
    if (currentProjectId && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProjectData(false); 
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  
  useEffect(() => {
    
    let isMounted = true;

    const loadProjectData = async () => {
      const projectId = localStorage.getItem("currentProjectId");
      if (!projectId || !isLoggedIn) return;
      if (currentProject && currentProject._id === projectId) {
        setFiles(currentProject.files);
        setMessages(currentProject.messages || []);
        setCurrentProjectId(currentProject._id);
        return;
      }
      
      try {
        const project = await dispatch(fetchProjectById(projectId)).unwrap();
        
       
        if (!isMounted) return;
        
        setFiles(project.files);
        setMessages(project.messages || []);
        setCurrentProjectId(project._id);
      } catch (error) {
        console.error("Error loading project:", error);
        if (isMounted) {
          toast.error("Failed to load project data");
        }
      }
    };
    
    loadProjectData();
    
  
    return () => {
      isMounted = false;
    };
    
   
  }, [isLoggedIn]);

  
  const saveProjectData = async (showToast = true) => {
    if (!isLoggedIn) {
      if (showToast) {
        toast.error("You must be logged in to save projects");
      }
      return;
    }

    try {
      if (currentProjectId) {
        
        const updateData = {
          files,
          messages,
          lastModified: new Date()
        };
        
        await dispatch(updateProject({ 
          projectId: currentProjectId, 
          updateData
        })).unwrap();
        
        if (showToast) {
          toast.success("Project updated successfully!");
        }
      } else {
        
        const projects = JSON.parse(localStorage.getItem("userProjects") || "[]");
        const projectIndex = projects.findIndex(p => p.id === currentProjectId);
        
        if (projectIndex !== -1) {
          projects[projectIndex].files = files;
          projects[projectIndex].messages = messages;
          localStorage.setItem("userProjects", JSON.stringify(projects));
        }
      }
    } catch (error) {
      if (showToast) {
        toast.error(`Failed to save project: ${error.message || 'Unknown error'}`);
      }
      console.error("Save project error:", error);
    }
  };

 
  const saveAsNewProject = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to save projects");
      return;
    }

    const projectName = prompt("Enter a name for your project:", `Project ${new Date().toLocaleDateString()}`);
    
    if (!projectName) return; 
    
    try {
      const projectData = {
        name: projectName,
        description: "Generated website",
        files,
        messages
      };
      
      const result = await dispatch(createProject(projectData)).unwrap();
      setCurrentProjectId(result._id);
      localStorage.setItem("currentProjectId", result._id);
      
      toast.success("Project saved successfully!");
      
      
      const projects = JSON.parse(localStorage.getItem("userProjects") || "[]");
      const newProject = {
        id: result._id,
        name: projectName,
        description: "Generated website",
        date: new Date().toISOString(),
        files,
        messages
      };
      
      projects.push(newProject);
      localStorage.setItem("userProjects", JSON.stringify(projects));
    } catch (error) {
      toast.error(`Failed to save project: ${error.message || 'Unknown error'}`);
      console.error("Save project error:", error);
    }
  };

  
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);
  
      const response = await fetch("http://localhost:4000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          selectedFile,
          currentFiles: files
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        if (data.multiFileUpdate && data.updatedFiles) {
          // Handle multi-file update
          setFiles((prevFiles) => ({
            ...prevFiles,
            ...data.updatedFiles 
          }));
          
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: `I've updated the following files: ${data.updatedFilesList.join(', ')}`
            },
          ]);
        } else {
          // Handle single file update (backward compatibility)
          setFiles((prevFiles) => ({
            ...prevFiles,
            [selectedFile]: data.fileContent
          }));
          
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              content: `I've updated the ${selectedFile} file based on your request.`
            },
          ]);
        }
        
        if (!currentProjectId) {
          const newProjectId = Date.now().toString();
          localStorage.setItem("currentProjectId", newProjectId);
          setCurrentProjectId(newProjectId);
        }
      } else {
        throw new Error(data.error || "Failed to generate code");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, there was an error updating the code. Please try again."
        },
      ]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  const getFileLanguage = (filename) => {
    const ext = filename.split(".").pop();
    const languages = {
      html: "html",
      css: "css",
      js: "javascript",
    };
    return languages[ext] || "plaintext";
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Left Side - Chat */}
      <div className="w-1/3 border-r border-gray-800 bg-gray-900/50 flex flex-col h-screen">
          <div className="p-4 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm flex items-center justify-between">
            <Link to="/">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
                CodeVision
              </h2>
            </Link>
            
            <div className="flex space-x-3">
              <button
                onClick={saveAsNewProject}
                className="text-xs px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-md hover:bg-indigo-500/20 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Project
              </button>
              
              <button
                onClick={goToDashboard}
                className="text-xs px-3 py-1 bg-gray-700/20 text-gray-400 rounded-md hover:bg-gray-700/30 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Projects
              </button>
            </div>
          </div>
          <div 
            className="flex-1 px-4 py-5 overflow-y-auto space-y-5 scrollbar-hide"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(99, 102, 241, 0.3) transparent',
              msOverflowStyle: 'none'
            }}
          >
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                width: 4px;
                background-color: transparent;
              }
              .scrollbar-hide::-webkit-scrollbar-thumb {
                background-color: rgba(99, 102, 241, 0.3);
                border-radius: 10px;
              }
              .scrollbar-hide::-webkit-scrollbar-thumb:hover {
                background-color: rgba(99, 102, 241, 0.5);
              }
              .scrollbar-hide::-webkit-scrollbar-track {
                background-color: transparent;
              }
            `}</style>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
            message.role === "user" ? "flex-row-reverse" : ""
                } animate-fadeIn transition-all duration-300`}
              >
                <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md
            ${
              message.role === "ai" 
                ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
                : "bg-gradient-to-br from-blue-500 to-cyan-400"
            }`}
                >
            {message.role === "ai" ? (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
                </div>
                <div
            className={`flex-1 ${
              message.role === "user" ? "text-right" : ""
            }`}
                >
            <div
              className={`inline-block rounded-xl px-5 py-3 text-sm max-w-[85%] shadow-lg backdrop-blur-sm
              ${
                message.role === "ai"
                  ? "bg-gray-800/80 text-gray-100 border border-gray-700"
                  : "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-blue-100 border border-indigo-500/30"
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1 mx-1">
              {message.role === "ai" ? "CodeVision AI" : "You"} · {index === messages.length - 1 ? "Just now" : "Earlier"}
            </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
            <p className="text-gray-400 text-sm">Describe your website idea or request code changes</p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input - Improved spacing */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm">
            <div className="flex flex-col gap-3">
              <div className="p-[1px] rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500">
                <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your website or request changes..."
            className="w-full p-4 rounded-lg bg-gray-900/90 border-none focus:outline-none text-white placeholder-gray-400 text-sm resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (prompt.trim()) {
                  handleGenerate();
                }
              }
            }}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`py-4 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 
                hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 rounded-lg 
                flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25
                ${
                  (isLoading || !prompt.trim()) &&
                  "opacity-50 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Editor and Files */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Files Header - Improved tab design */}
        <div className="h-14 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm flex items-center px-6 justify-between">
          <div className="flex items-center space-x-2">
            {["index.html", "styles.css", "script.js"].map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all duration-200
                  ${
                    selectedFile === file
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/10"
                      : "text-gray-400 hover:bg-gray-800 hover:text-indigo-400"
                  }`}
              >
                <FileIcon filename={file} />
                {file}
              </button>
            ))}
          </div>

          {/* File actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-gray-800">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </button>

            <button onClick={copyFile} className="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-md hover:bg-gray-800">
              <Clipboard className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor - Improved container */}
        <div className="flex-1 relative overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage={getFileLanguage(selectedFile)}
            language={getFileLanguage(selectedFile)}
            theme="vs-dark"
            value={files[selectedFile] || ""}
            onChange={(value) => {
              setFiles((prev) => ({
                ...prev,
                [selectedFile]: value || "",
              }));
            }}
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
                vertical: "visible",
                horizontal: "visible",
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
              bracketPairColorization: {
                enabled: true,
              },
            }}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("custom-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: {
                  "editor.background": "#111827",
                  "editor.lineHighlightBackground": "#1f2937",
                  "editorLineNumber.foreground": "#4b5563",
                  "editorLineNumber.activeForeground": "#9ca3af",
                  "editor.selectionBackground": "#374151",
                  "editor.inactiveSelectionBackground": "#374151",
                },
              });
            }}
            onMount={(editor, monaco) => {
              monaco.editor.setTheme("custom-dark");
              // Trigger layout update
              setTimeout(() => {
                editor.layout();
              }, 100);
            }}
          />
        </div>

        {/* Editor Footer - Improved design */}
        <div className="h-8 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm flex items-center px-6 justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              {getFileLanguage(selectedFile).toUpperCase()}
            </span>
            <span>UTF-8</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Line: 1</span>
            <span>Col: 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// File icon component
const FileIcon = ({ filename }) => {
  const getIcon = (filename) => {
    const ext = filename.split(".").pop();
    switch (ext) {
      case "html":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "css":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      case "js":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return getIcon(filename);
};

export default Generator;
