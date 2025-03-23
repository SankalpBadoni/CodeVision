import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn')
      const email = localStorage.getItem('userEmail')
      setIsLoggedIn(loggedInStatus === 'true')
      setUserEmail(email || '')
    }

    // Check initially
    checkLoginStatus()

    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus)
    
    // Custom event listener for login status changes
    window.addEventListener('loginStatusChanged', checkLoginStatus)

    return () => {
      window.removeEventListener('storage', checkLoginStatus)
      window.removeEventListener('loginStatusChanged', checkLoginStatus)
    }
  }, [])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setShowDropdown(false)
    navigate('/')
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return 'U'
    return userEmail.split('@')[0].substring(0, 2).toUpperCase()
  }

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">CodeVision</Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>
            
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-white hover:text-indigo-400 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-semibold">{getUserInitials()}</span>
                  </div>
                  <span>{userEmail}</span>
                  <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-20">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800" onClick={() => setShowDropdown(false)}>
                      Your Profile
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800" onClick={() => setShowDropdown(false)}>
                      Your Projects
                    </Link>
                    <div className="border-t border-gray-800 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                >
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 