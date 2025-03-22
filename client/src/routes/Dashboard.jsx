import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus !== 'true') {
      navigate('/login');
    } else {
      setIsLoggedIn(true);
      // Load projects from localStorage
      loadProjects();
    }
  }, [navigate]);

  // Load projects from localStorage
  const loadProjects = () => {
    // Get existing projects or create dummy ones if none exist
    const savedProjects = localStorage.getItem('userProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Create dummy projects for demo
      const dummyProjects = [
        {
          id: '1',
          name: 'E-commerce Website',
          description: 'Online store with product listings and shopping cart',
          date: '2023-11-20',
          messages: [
            { role: 'user', content: 'Create an e-commerce website with modern design' },
            { role: 'ai', content: 'I have generated an e-commerce website with product listings and shopping cart functionality.' }
          ],
          files: {
            'index.html': '<html><head><title>E-commerce Store</title></head><body><h1>Welcome to our store!</h1></body></html>',
            'styles.css': 'body { font-family: Arial; }',
            'script.js': 'console.log("E-commerce site loaded");'
          }
        },
        {
          id: '2',
          name: 'Portfolio Site',
          description: 'Professional portfolio to showcase work',
          date: '2023-11-25',
          messages: [
            { role: 'user', content: 'Build a portfolio website for a graphic designer' },
            { role: 'ai', content: 'I have created a portfolio site with project showcase and contact form.' }
          ],
          files: {
            'index.html': '<html><head><title>Designer Portfolio</title></head><body><h1>My Portfolio</h1></body></html>',
            'styles.css': 'body { background: #f5f5f5; }',
            'script.js': 'console.log("Portfolio loaded");'
          }
        }
      ];
      
      setProjects(dummyProjects);
      localStorage.setItem('userProjects', JSON.stringify(dummyProjects));
    }
  };

  // Continue project - load files and navigate to generator
  const continueProject = (project) => {
    localStorage.setItem('generatedFiles', JSON.stringify(project.files));
    localStorage.setItem('chatMessages', JSON.stringify(project.messages));
    localStorage.setItem('currentProjectId', project.id);
    navigate('/generator');
  };

  // Create new project
  const createNewProject = () => {
    navigate('/');
  };

  if (!isLoggedIn) {
    return <div className="container mx-auto px-4 pt-24">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">Your Projects</h2>
          <button 
            onClick={createNewProject}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onContinue={() => continueProject(project)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onContinue }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="p-6 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-md hover:shadow-indigo-500/10">
      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">{project.name}</h3>
      <p className="text-gray-400 mb-3 text-sm">{project.description}</p>
      <div className="text-xs text-gray-500 mb-4">Created: {formatDate(project.date)}</div>
      
      <div className="mb-4 p-3 bg-gray-900/80 rounded-md border border-gray-700 max-h-24 overflow-y-auto">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Chat History</h4>
        {project.messages.map((message, index) => (
          <div key={index} className="text-xs mb-1">
            <span className={message.role === 'user' ? 'text-indigo-400' : 'text-gray-300'}>
              {message.role === 'user' ? 'You: ' : 'AI: '}
            </span>
            <span className="text-gray-400">
              {message.content.length > 70 ? `${message.content.substring(0, 70)}...` : message.content}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-4 mt-auto">
        <button 
          onClick={onContinue}
          className="flex-1 text-sm py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 rounded-md transition-colors border border-indigo-600/20"
        >
          Continue
        </button>
        <button className="flex-1 text-sm py-2 bg-gray-700/20 text-gray-400 hover:bg-gray-700/30 rounded-md transition-colors border border-gray-700/20">
          Export
        </button>
      </div>
    </div>
  );
};

export default Dashboard 