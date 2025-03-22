import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import { TextRevealCardTitle } from '../components/TitleCard';


const Home = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear previous project data to start fresh
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('currentProjectId');
        
        // Save new generated files
        localStorage.setItem('generatedFiles', JSON.stringify(data.files));
        navigate('/generator');
      } else {
        throw new Error(data.error || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Error:', error);
      // Add a visual error message
      alert(error.message || 'An error occurred while generating the code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center pt-20 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="space-y-8 mb-10">
          <div className="inline-block">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Powered by Advanced AI Technology
            </span>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
        <motion.div 
          className="absolute top-10 left-0 w-full h-[35%] opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 20%)", 
              "radial-gradient(circle at 80% 80%, #312e81 0%, transparent 20%)", 
              "radial-gradient(circle at 20% 80%, #4338ca 0%, transparent 20%)",
              "radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 20%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text leading-tight">
              Transform Your Vision Into Reality
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              Build sophisticated, production-ready websites in minutes with our 
              <span className="text-blue-400 font-normal"> AI-powered platform</span>
            </p>
          </div>
        </div>
        
        <div className="w-full max-w-2xl space-y-4 relative">
          <div className="p-[1px] rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your ideal website - from e-commerce platforms to professional portfolios..."
              className="w-full p-4 rounded-lg bg-gray-900/90 border-none focus:outline-none text-white placeholder-gray-400 text-lg"
              rows={4}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className={`w-full py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 
              hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg 
              hover:shadow-xl rounded-lg flex items-center justify-center gap-2 
              ${(isLoading || !prompt.trim()) && 'opacity-50 cursor-not-allowed'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Your Website</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500">Enterprise-grade development • Instant deployment • No coding required</p>
        </div>

        {/* Features Section */}
        <div className="mt-24 w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
            Enterprise-Grade Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <FeatureCard 
              icon={<ServerIcon />}
              title="Advanced Infrastructure"
              description="Built on cutting-edge technology stack ensuring scalability, security, and performance."
            />
            <FeatureCard 
              icon={<SpeedIcon />}
              title="Rapid Development"
              description="Transform requirements into fully functional websites in minutes, not months."
            />
            <FeatureCard 
              icon={<CustomizeIcon />}
              title="Complete Customization"
              description="Fine-tune every aspect of your website with our intuitive interface."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 group">
    <div className="text-indigo-500 mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
      {title}
    </h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
)

// SVG Icons
const ServerIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
)

const SpeedIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const CustomizeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
)

export default Home 