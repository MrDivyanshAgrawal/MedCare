import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserMd, FaUserInjured, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setLoading(true);
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      toast.success('Registration successful!');
      
      // Redirect to profile completion page based on role
      switch (result.user.role) {
        case 'patient':
          navigate('/patient-profile-setup');
          break;
        case 'doctor':
          navigate('/doctor-profile-setup');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
        <p className="text-gray-600 mt-2">Register to access our services</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm"
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            I am a
          </label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div 
              className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors
                ${formData.role === 'patient' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
              `}
              onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
            >
              <FaUserInjured className="text-2xl mb-1" />
              <span className="text-sm font-medium">Patient</span>
            </div>
            <div 
              className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors
                ${formData.role === 'doctor' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
              `}
              onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
            >
              <FaUserMd className="text-2xl mb-1" />
              <span className="text-sm font-medium">Doctor</span>
            </div>
            <div 
              className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors
                ${formData.role === 'admin' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
              `}
              onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
            >
              <FaUserShield className="text-2xl mb-1" />
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          ) : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
