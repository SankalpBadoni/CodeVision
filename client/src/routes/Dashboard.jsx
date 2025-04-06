import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProjects } from '../redux/slices/ProjectSlice.js';
import { setCurrentProject } from '../redux/slices/ProjectSlice.js';

const Dashboard = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { projects, isLoading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    dispatch(fetchUserProjects());
  }, [dispatch, isLoggedIn]);

  const continueProject = (project) => {
    dispatch(setCurrentProject(project));

    localStorage.setItem('generatedFiles', JSON.stringify(project.files));
    localStorage.setItem('chatMessages', JSON.stringify(project.messages));
    localStorage.setItem('currentProjectId', project._id); // Using MongoDB _id now
    
    navigate('/generator');
  };

  const createNewProject = () => {
    navigate('/');
  };

  if (!isLoggedIn) {
    return <div className="container mx-auto px-4 pt-24">Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Projects</h3>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => dispatch(fetchUserProjects())}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
        
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative">
              {/* Background gradient effect */}
              <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                <div className="relative aspect-[1200/800] w-[72.1875rem] opacity-20"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgb(99 102 241 / 0.2), transparent 80%)',
                  }}
                />
              </div>
              
              {/* Empty state content */}
              <div className="w-24 h-24 mb-8 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
                Create Your First Project
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Get started by creating a new project. Use AI to generate your website and manage all your projects in one place.
              </p>
              <button
                onClick={createNewProject}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 
                  hover:from-indigo-700 hover:to-blue-600 text-white transition-all duration-300 
                  shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Start Creating
              </button>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                <FeatureCard 
                  icon={<AIIcon />}
                  title="AI-Powered"
                  description="Generate complete websites using advanced AI technology"
                />
                <FeatureCard 
                  icon={<CustomizeIcon />}
                  title="Customizable"
                  description="Edit and customize your generated code in real-time"
                />
                <FeatureCard 
                  icon={<SaveIcon />}
                  title="Auto-Saving"
                  description="Your projects are automatically saved and organized"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                onContinue={() => continueProject(project)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-lg bg-gray-800/30 border border-gray-700 hover:border-indigo-500/30 transition-all duration-300">
    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="text-lg font-semibold mb-2 text-gray-200">{title}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

// Icons
const AIIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CustomizeIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

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