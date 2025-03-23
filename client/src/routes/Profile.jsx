import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userEmail, username, isLoggedIn } = useSelector((state) => state.auth);
  console.log('User data:', { userEmail, username });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: 'No bio added yet',
    theme: 'dark',
    notifications: true
  });

  // Protect route
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  // Update form data when user data changes
  useEffect(() => {
    if (userEmail) {
      setFormData(prevData => ({
        ...prevData,
        name: username || userEmail.split('@')[0],
        email: userEmail
      }));
    }
  }, [userEmail, username]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user profile
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
            Profile Settings
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 
              hover:from-indigo-700 hover:to-blue-600 text-white transition-all duration-300 
              shadow-lg hover:shadow-xl text-sm font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Content */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200">{formData.name}</h3>
                <p className="text-gray-400">{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-4">Personal Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                        text-gray-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                        text-gray-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                        text-gray-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

             
              <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-4">Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-200">Theme</h5>
                      <p className="text-xs text-gray-400">Choose your preferred theme</p>
                    </div>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 
                        text-gray-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-200">Notifications</h5>
                      <p className="text-xs text-gray-400">Receive email notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              
              {isEditing && (
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 
                      hover:from-indigo-700 hover:to-blue-600 text-white transition-all duration-300 
                      shadow-lg hover:shadow-xl text-sm font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
