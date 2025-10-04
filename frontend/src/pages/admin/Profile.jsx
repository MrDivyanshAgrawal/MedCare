// src/pages/admin/Profile.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingButton } from '../../components/LoadingSpinner';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaUserShield, 
  FaUserCog,
  FaCamera,
  FaCheck,
  FaExclamationTriangle,
  FaShieldAlt,
  FaKey
} from 'react-icons/fa';
import useFormValidation from '../../hooks/useFormValidation';

const AdminProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Initial profile data
  const INITIAL_PROFILE_STATE = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    profilePicture: currentUser?.profilePicture || '',
  };

  // Initial password data
  const INITIAL_PASSWORD_STATE = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // Validation function for profile
  const validateProfileForm = (values) => {
    const errors = {};
    
    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (values.phone && !/^\d{10,15}$/.test(values.phone.replace(/[()-\s]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return errors;
  };

  // Validation function for password
  const validatePasswordForm = (values) => {
    const errors = {};
    
    if (!values.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!values.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (values.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  // Handle profile form submission
  const handleProfileSubmit = async (values) => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone || '');
      
      if (imageFile) {
        formData.append('profilePicture', imageFile);
      }
      
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      
      // Reset image file state after successful update
      setImageFile(null);
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (values) => {
    try {
      await api.put('/users/password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      
      toast.success('Password changed successfully');
      
      // Reset form
      passwordForm.resetForm();
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
      throw error;
    }
  };

  // Use form validation hook for profile
  const profileForm = useFormValidation(
    INITIAL_PROFILE_STATE,
    validateProfileForm,
    handleProfileSubmit
  );

  // Use form validation hook for password
  const passwordForm = useFormValidation(
    INITIAL_PASSWORD_STATE,
    validatePasswordForm,
    handlePasswordSubmit
  );

  // Set image preview when user uploads a new profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize profile form with user data
  useEffect(() => {
    if (currentUser) {
      profileForm.setValues({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        profilePicture: currentUser.profilePicture || '',
      });
      
      if (currentUser.profilePicture) {
        setImagePreview(currentUser.profilePicture);
      }
    }
  }, [currentUser]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaUserShield className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
                <p className="text-purple-100 text-lg mt-1">
                  Manage your account information and settings
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'profile' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="inline-block mr-2 h-4 w-4" />
              Profile Information
            </button>
            <button
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'password' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('password')}
            >
              <FaLock className="inline-block mr-2 h-4 w-4" />
              Change Password
            </button>
          </div>
          
          <div className="p-8">
            {activeTab === 'profile' ? (
              <form onSubmit={profileForm.handleSubmit} className="space-y-8">
                {/* Profile Picture and Role Section */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center ring-4 ring-white shadow-xl">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <FaUserCog className="h-20 w-20 text-purple-400" />
                        )}
                      </div>
                      <label 
                        htmlFor="profile-picture" 
                        className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-full cursor-pointer hover:from-purple-700 hover:to-purple-800 shadow-lg transform transition-all duration-200 hover:scale-110"
                      >
                        <FaCamera className="h-5 w-5" />
                      </label>
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-3">Click camera to upload</p>
                  </div>

                  {/* Role Badge */}
                  <div className="flex-1 w-full">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center">
                        <div className="p-3 bg-white rounded-full shadow-md">
                          <FaShieldAlt className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-purple-600">Account Type</p>
                          <p className="text-2xl font-bold text-purple-800">Administrator</p>
                          <p className="text-xs text-purple-600 mt-1">Full system access</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileForm.values.name}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                          profileForm.touched.name && profileForm.errors.name 
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {profileForm.touched.name && profileForm.errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        {profileForm.errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.values.email}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                          profileForm.touched.email && profileForm.errors.email 
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        }`}
                        placeholder="admin@example.com"
                      />
                    </div>
                    {profileForm.touched.email && profileForm.errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        {profileForm.errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileForm.values.phone}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                          profileForm.touched.phone && profileForm.errors.phone 
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        }`}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    {profileForm.touched.phone && profileForm.errors.phone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        {profileForm.errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <LoadingButton
                    type="submit"
                    isLoading={profileForm.isSubmitting}
                    disabled={profileForm.isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <FaCheck className="mr-2 h-4 w-4" />
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            ) : (
              <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
                {/* Security Info */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 bg-yellow-200 rounded-lg">
                      <FaKey className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-yellow-800">Password Security</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Ensure your new password is at least 6 characters long and contains a mix of letters, numbers, and symbols.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        value={passwordForm.values.currentPassword}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                          passwordForm.touched.currentPassword && passwordForm.errors.currentPassword 
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        }`}
                        placeholder="Enter current password"
                      />
                    </div>
                    {passwordForm.touched.currentPassword && passwordForm.errors.currentPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        {passwordForm.errors.currentPassword}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        value={passwordForm.values.newPassword}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                          passwordForm.touched.newPassword && passwordForm.errors.newPassword 
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        }`}
                        placeholder="Enter new password"
                      />
                    </div>
                    {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        {passwordForm.errors.newPassword}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={passwordForm.values.confirmPassword}
                        onChange={passwordForm.handleChange}
                        onBlur={passwordForm.handleBlur}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                          passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword 
                            ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
                            : 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        }`}
                        placeholder="Confirm new password"
                      />
                    </div>
                    {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        {passwordForm.errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <LoadingButton
                    type="submit"
                    isLoading={passwordForm.isSubmitting}
                    disabled={passwordForm.isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <FaKey className="mr-2 h-4 w-4" />
                    Change Password
                  </LoadingButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
