import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserMd, FaUserInjured, FaUserShield, FaEye, FaEyeSlash, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { LoadingButton } from '../components/LoadingSpinner';
import useFormValidation from '../hooks/useFormValidation';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Initial state for validation
  const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'patient',
    adminCode: ''
  };
  
  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    return strength;
  };
  
  // Validation function
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name.trim()) {
      errors.name = 'Name is required';
    } else if (values.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (values.phone && !/^(\+91)?[6-9]\d{9}$/.test(values.phone.replace(/[()-\s]/g, ''))) {
      errors.phone = 'Please enter a valid Indian phone number';
    }
    
    if (values.role === 'admin' && !values.adminCode) {
      errors.adminCode = 'Admin code is required';
    } else if (values.role === 'admin' && values.adminCode !== '123456') {
      errors.adminCode = 'Invalid admin code';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleRegister = async (values) => {
    try {
      // Remove confirmPassword and adminCode before sending to API
      const { confirmPassword, adminCode, ...registerData } = values;
      
      const data = await register(registerData);
      
      // Redirect based on role
      const dashboardRoutes = {
        patient: '/patient/dashboard',
        doctor: '/doctor/dashboard',
        admin: '/admin/dashboard'
      };
      
      navigate(dashboardRoutes[data.role] || '/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Use form validation hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues
  } = useFormValidation(INITIAL_STATE, validateForm, handleRegister);
  
  // Handle role selection
  const handleRoleChange = (role) => {
    setValues({
      ...values,
      role
    });
  };

  const passwordStrength = checkPasswordStrength(values.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-4 shadow-lg">
              <FaUserShield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  I want to register as
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      values.role === 'patient'
                        ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleChange('patient')}
                  >
                    {values.role === 'patient' && (
                      <FaCheckCircle className="absolute top-2 right-2 h-4 w-4 text-blue-600" />
                    )}
                    <FaUserInjured className={`h-8 w-8 ${values.role === 'patient' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`mt-2 text-sm font-medium ${values.role === 'patient' ? 'text-blue-700' : 'text-gray-700'}`}>
                      Patient
                    </span>
                  </div>

                  <div
                    className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      values.role === 'doctor'
                        ? 'border-green-500 bg-green-50 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleChange('doctor')}
                  >
                    {values.role === 'doctor' && (
                      <FaCheckCircle className="absolute top-2 right-2 h-4 w-4 text-green-600" />
                    )}
                    <FaUserMd className={`h-8 w-8 ${values.role === 'doctor' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`mt-2 text-sm font-medium ${values.role === 'doctor' ? 'text-green-700' : 'text-gray-700'}`}>
                      Doctor
                    </span>
                  </div>

                  <div
                    className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      values.role === 'admin'
                        ? 'border-purple-500 bg-purple-50 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleChange('admin')}
                  >
                    {values.role === 'admin' && (
                      <FaCheckCircle className="absolute top-2 right-2 h-4 w-4 text-purple-600" />
                    )}
                    <FaUserShield className={`h-8 w-8 ${values.role === 'admin' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className={`mt-2 text-sm font-medium ${values.role === 'admin' ? 'text-purple-700' : 'text-gray-700'}`}>
                      Admin
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      touched.name && errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="Rajesh Kumar"
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      touched.email && errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="you@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      touched.password && errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {values.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${passwordStrength > 2 ? 'text-green-600' : 'text-orange-600'}`}>
                        {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                      </span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strengthColors[passwordStrength - 1] || 'bg-gray-300'}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number <span className="text-gray-400">(optional)</span>
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      touched.phone && errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    placeholder="+91 98765 43210"
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              
              {values.role === 'admin' && (
                <div>
                  <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">
                    Admin Registration Code
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="adminCode"
                      name="adminCode"
                      type="password"
                      value={values.adminCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        touched.adminCode && errors.adminCode ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter admin code"
                    />
                  </div>
                  {touched.adminCode && errors.adminCode && (
                    <p className="mt-2 text-sm text-red-600">{errors.adminCode}</p>
                  )}
                  <div className="mt-2 flex items-start">
                    <FaInfoCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="ml-2 text-xs text-gray-600">
                      For demo purposes, use code: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">123456</span>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Create account
                </LoadingButton>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    By registering, you agree to our
                  </span>
                </div>
              </div>

              <div className="mt-2 text-center text-xs text-gray-500">
                <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
