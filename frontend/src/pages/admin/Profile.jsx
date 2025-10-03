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
  FaCamera
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <h1 className="text-2xl font-bold">Admin Profile</h1>
            <p className="mt-1 text-purple-100">
              Manage your account information and settings
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'profile' 
                  ? 'text-purple-600 border-b-2 border-purple-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="inline-block mr-2" />
              Profile Information
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'password' 
                  ? 'text-purple-600 border-b-2 border-purple-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('password')}
            >
              <FaLock className="inline-block mr-2" />
              Change Password
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' ? (
              <form onSubmit={profileForm.handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="relative w-32 h-32 mb-4 sm:mb-0 sm:mr-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <FaUserCog className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <label 
                      htmlFor="profile-picture" 
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700"
                    >
                      <FaCamera className="h-4 w-4" />
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <div className="border border-gray-300 rounded-md p-4">
                      <div className="flex items-center text-gray-800">
                        <FaUserShield className="h-5 w-5 text-purple-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Role</div>
                          <div className="text-lg">Administrator</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileForm.values.name}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        profileForm.touched.name && profileForm.errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                  </div>
                  {profileForm.touched.name && profileForm.errors.name && (
                    <p className="mt-2 text-sm text-red-600">{profileForm.errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.values.email}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        profileForm.touched.email && profileForm.errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                  </div>
                  {profileForm.touched.email && profileForm.errors.email && (
                    <p className="mt-2 text-sm text-red-600">{profileForm.errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileForm.values.phone}
                      onChange={profileForm.handleChange}
                      onBlur={profileForm.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        profileForm.touched.phone && profileForm.errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  {profileForm.touched.phone && profileForm.errors.phone && (
                    <p className="mt-2 text-sm text-red-600">{profileForm.errors.phone}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    isLoading={profileForm.isSubmitting}
                    disabled={profileForm.isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            ) : (
              <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={passwordForm.values.currentPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        passwordForm.touched.currentPassword && passwordForm.errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                  </div>
                  {passwordForm.touched.currentPassword && passwordForm.errors.currentPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordForm.errors.currentPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      value={passwordForm.values.newPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        passwordForm.touched.newPassword && passwordForm.errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                  </div>
                  {passwordForm.touched.newPassword && passwordForm.errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordForm.errors.newPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
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
                      value={passwordForm.values.confirmPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                  </div>
                  {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordForm.errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    isLoading={passwordForm.isSubmitting}
                    disabled={passwordForm.isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
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
