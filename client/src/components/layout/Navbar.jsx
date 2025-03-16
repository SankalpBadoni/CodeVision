import { Link } from 'react-router-dom'


const Navbar = () => {
  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">CodeVision</Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>
            
            <Link to="/login">
            <button 
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              Get Started
            </button></Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 