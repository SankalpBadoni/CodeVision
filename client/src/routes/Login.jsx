import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Dummy login logic - in a real app, this would call an API
    if (email === 'user@example.com' && password === 'password') {
      // Set login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try user@example.com / password');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <div className="w-full max-w-md bg-transparent border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
          Login
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 bg-gray-800/50"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 bg-gray-800/50"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Instructions */}
          <div className="text-xs text-gray-500 italic">
            Use email: user@example.com and password: password
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Forgot Password + Signup */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="#" className="text-indigo-500 hover:underline">
            Forgot your password?
          </a>
          <span className="mx-2">•</span>
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
