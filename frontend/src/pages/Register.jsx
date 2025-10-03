// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserMd, FaUserInjured, FaUserShield } from 'react-icons/fa';
import { LoadingButton } from '../components/LoadingSpinner';
import useFormValidation from '../hooks/useFormValidation';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
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
  
  // Validation function
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name.trim()) {
      errors.name = 'Name is required';
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
    
    if (values.phone && !/^\d{10,15}$/.test(values.phone.replace(/[()-\s]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (values.role === 'admin' && !values.adminCode) {
      errors.adminCode = 'Admin code is required';
    } else if (values.role === 'admin' && values.adminCode !== process.env.REACT_APP_ADMIN_CODE && values.adminCode !== '123456') {
      // In a real app, you'd validate this against a secure value from your backend
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      touched.name && errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="John Doe"
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
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      touched.email && errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      touched.password && errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number (optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      touched.phone && errors.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="(123) 456-7890"
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Register as
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  <div
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                      values.role === 'patient'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleChange('patient')}
                  >
                    <FaUserInjured className={`h-8 w-8 ${values.role === 'patient' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className={`mt-1 text-sm font-medium ${values.role === 'patient' ? 'text-blue-700' : 'text-gray-700'}`}>
                      Patient
                    </span>
                  </div>

                  <div
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                      values.role === 'doctor'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleChange('doctor')}
                  >
                    <FaUserMd className={`h-8 w-8 ${values.role === 'doctor' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className={`mt-1 text-sm font-medium ${values.role === 'doctor' ? 'text-blue-700' : 'text-gray-700'}`}>
                      Doctor
                    </span>
                  </div>
                  
                  <div
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                      values.role === 'admin'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleChange('admin')}
                  >
                    <FaUserShield className={`h-8 w-8 ${values.role === 'admin' ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className={`mt-1 text-sm font-medium ${values.role === 'admin' ? 'text-blue-700' : 'text-gray-700'}`}>
                      Admin
                    </span>
                  </div>
                </div>
              </div>
              
              {values.role === 'admin' && (
                <div>
                  <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">
                    Admin Registration Code
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
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
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        touched.adminCode && errors.adminCode ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter admin code"
                    />
                  </div>
                  {touched.adminCode && errors.adminCode && (
                    <p className="mt-2 text-sm text-red-600">{errors.adminCode}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    For demonstration, use code: 123456
                  </p>
                </div>
              )}

              <div>
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
