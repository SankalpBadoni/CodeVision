import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <div className="w-full max-w-md bg-transparent border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200" placeholder="Enter your username" required />
            </div>
        
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
              placeholder="Enter your email"
              required
            />
          </div>

   
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
              placeholder="Enter your password"
              required
            />
          </div>


          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
