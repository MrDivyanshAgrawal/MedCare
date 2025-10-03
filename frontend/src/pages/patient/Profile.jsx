// src/pages/patient/Profile.jsx
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaTint, FaMapMarkerAlt, FaUserInjured, FaExclamationTriangle } from 'react-icons/fa';
import LoadingSpinner, { LoadingButton } from '../../components/LoadingSpinner';
import useFormValidation from '../../hooks/useFormValidation';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initial user form state
  const initialUserForm = {
    name: '',
    email: '',
    phone: '',
    profilePicture: ''
  };

  // Initial patient form state
  const initialPatientForm = {
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    allergies: [],
    chronicConditions: []
  };

  // Validation functions
  const validateUserForm = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    return errors;
  };

  const validatePatientForm = (values) => {
    const errors = {};
    if (!values.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!values.gender) errors.gender = 'Gender is required';
    return errors;
  };

  // Form handling with useFormValidation
  const {
    values: userForm,
    errors: userErrors,
    touched: userTouched,
    isSubmitting: userSubmitting,
    handleChange: handleUserChange,
    handleBlur: handleUserBlur,
    handleSubmit: handleUserFormSubmit,
    resetForm: resetUserForm,
    setValues: setUserForm
  } = useFormValidation(
    initialUserForm,
    validateUserForm,
    submitUserForm
  );

  const {
    values: patientForm,
    errors: patientErrors,
    touched: patientTouched,
    isSubmitting: patientSubmitting,
    handleChange: handlePatientChange,
    handleBlur: handlePatientBlur,
    handleSubmit: handlePatientFormSubmit,
    resetForm: resetPatientForm,
    setValues: setPatientForm
  } = useFormValidation(
    initialPatientForm,
    validatePatientForm,
    submitPatientForm
  );

  useEffect(() => {
    fetchUserAndPatientProfiles();
  }, []);

  const fetchUserAndPatientProfiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch user profile
      const userResponse = await api.get('/users/profile');
      setUserProfile(userResponse.data);
      setUserForm({
        name: userResponse.data.name,
        email: userResponse.data.email,
        phone: userResponse.data.phone || '',
        profilePicture: userResponse.data.profilePicture || ''
      });

      // Fetch patient profile
      try {
        const patientResponse = await api.get('/patients/me');
        setPatientProfile(patientResponse.data);
        setPatientForm({
          dateOfBirth: patientResponse.data.dateOfBirth ? new Date(patientResponse.data.dateOfBirth).toISOString().split('T')[0] : '',
          gender: patientResponse.data.gender || '',
          bloodGroup: patientResponse.data.bloodGroup || '',
          address: patientResponse.data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          emergencyContact: patientResponse.data.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          },
          allergies: patientResponse.data.allergies || [],
          chronicConditions: patientResponse.data.chronicConditions || []
        });
      } catch (err) {
        // It's okay if patient profile doesn't exist yet
        console.log('Patient profile not found or not created yet');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profile data. Please refresh and try again.');
      setIsLoading(false);
    }
  };

  // Custom handler for nested patient form fields
  const handleNestedPatientChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPatientForm({
        ...patientForm,
        [parent]: {
          ...patientForm[parent],
          [child]: value
        }
      });
    } else {
      handlePatientChange(e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload profile picture');
      return null;
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setPatientForm({
        ...patientForm,
        allergies: [...patientForm.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index) => {
    setPatientForm({
      ...patientForm,
      allergies: patientForm.allergies.filter((_, i) => i !== index)
    });
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setPatientForm({
        ...patientForm,
        chronicConditions: [...patientForm.chronicConditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index) => {
    setPatientForm({
      ...patientForm,
      chronicConditions: patientForm.chronicConditions.filter((_, i) => i !== index)
    });
  };

  async function submitUserForm(values) {
    try {
      setSubmitting(true);
      const updatedUserData = { ...values };

      // Upload image if changed
      if (imageFile) {
        const imageUrl = await uploadImage();
        if (imageUrl) {
          updatedUserData.profilePicture = imageUrl;
        }
      }

      await updateProfile(updatedUserData);
      setUserProfile(prev => ({
        ...prev,
        ...updatedUserData
      }));
      setIsEditingUser(false);
      toast.success('User profile updated successfully');
    } catch (err) {
      console.error('Error updating user profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitPatientForm(values) {
    try {
      setSubmitting(true);
      let response;
      
      if (patientProfile) {
        // Update existing patient profile
        response = await api.put(`/patients/${patientProfile._id}`, values);
      } else {
        // Create new patient profile
        response = await api.post('/patients', values);
      }
      
      setPatientProfile(response.data);
      setIsEditingPatient(false);
      toast.success(patientProfile ? 'Patient profile updated successfully' : 'Patient profile created successfully');
    } catch (err) {
      console.error('Error updating patient profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update patient profile');
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="large" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="mt-1 text-blue-100">
              Manage your personal information and medical details
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
            {!isEditingUser ? (
              <button
                onClick={() => setIsEditingUser(true)}
                className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingUser(false);
                  resetUserForm();
                  setUserForm({
                    name: userProfile.name,
                    email: userProfile.email,
                    phone: userProfile.phone || '',
                    profilePicture: userProfile.profilePicture || ''
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="px-3 py-1 border border-gray-300 text-sm rounded-md text-red-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="px-6 py-4">
            {isEditingUser ? (
              <form onSubmit={handleUserFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-3">
                      <img
                        src={imagePreview || userForm.profilePicture || "https://via.placeholder.com/128"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="px-3 py-1.5 border border-gray-300 text-sm rounded-md cursor-pointer bg-white hover:bg-gray-50">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={userForm.name}
                        onChange={handleUserChange}
                        onBlur={handleUserBlur}
                        required
                        className={`mt-1 block w-full border ${userTouched.name && userErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {userTouched.name && userErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{userErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={userForm.email}
                        onChange={handleUserChange}
                        onBlur={handleUserBlur}
                        required
                        className={`mt-1 block w-full border ${userTouched.email && userErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                      {userTouched.email && userErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{userErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={userForm.phone}
                        onChange={handleUserChange}
                        onBlur={handleUserBlur}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end">
                      <LoadingButton
                        type="submit"
                        isLoading={submitting || userSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={userProfile.profilePicture || "https://via.placeholder.com/128"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center">
                    <FaUser className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaEnvelope className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-sm font-medium text-gray-900">{userProfile.email}</p>
                    </div>
                  </div>

                  {userProfile.phone && (
                    <div className="flex items-center">
                      <FaPhone className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-sm font-medium text-gray-900">{userProfile.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Profile Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Medical Information</h2>
            {!isEditingPatient ? (
              <button
                onClick={() => setIsEditingPatient(true)}
                className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
              >
                {patientProfile ? 'Edit' : 'Complete Profile'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingPatient(false);
                  resetPatientForm();
                  if (patientProfile) {
                    setPatientForm({
                      dateOfBirth: patientProfile.dateOfBirth ? new Date(patientProfile.dateOfBirth).toISOString().split('T')[0] : '',
                      gender: patientProfile.gender || '',
                      bloodGroup: patientProfile.bloodGroup || '',
                      address: patientProfile.address || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: ''
                      },
                      emergencyContact: patientProfile.emergencyContact || {
                        name: '',
                        phone: '',
                        relationship: ''
                      },
                      allergies: patientProfile.allergies || [],
                      chronicConditions: patientProfile.chronicConditions || []
                    });
                  }
                  setNewAllergy('');
                  setNewCondition('');
                }}
                className="px-3 py-1 border border-gray-300 text-sm rounded-md text-red-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="px-6 py-4">
            {!patientProfile && !isEditingPatient ? (
              <div className="text-center py-8">
                <FaUserInjured className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No medical profile yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your medical profile for better healthcare.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditingPatient(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Complete Medical Profile
                  </button>
                </div>
              </div>
            ) : isEditingPatient ? (
              <form onSubmit={handlePatientFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={patientForm.dateOfBirth}
                      onChange={handlePatientChange}
                      onBlur={handlePatientBlur}
                      required
                      className={`mt-1 block w-full border ${patientTouched.dateOfBirth && patientErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {patientTouched.dateOfBirth && patientErrors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{patientErrors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={patientForm.gender}
                      onChange={handlePatientChange}
                      onBlur={handlePatientBlur}
                      required
                      className={`mt-1 block w-full border ${patientTouched.gender && patientErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {patientTouched.gender && patientErrors.gender && (
                      <p className="mt-1 text-sm text-red-600">{patientErrors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={patientForm.bloodGroup}
                      onChange={handlePatientChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Rest of the form... */}
                
                {/* Address Section */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        Street
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        id="street"
                        value={patientForm.address.street}
                        onChange={handleNestedPatientChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        id="city"
                        value={patientForm.address.city}
                        onChange={handleNestedPatientChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    {/* Other address fields... */}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    isLoading={submitting || patientSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {patientProfile ? 'Update Medical Profile' : 'Create Medical Profile'}
                  </LoadingButton>
                </div>
              </form>
            ) : (
              // Display patient profile information
              <div className="space-y-6">
                {/* Patient information display... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
