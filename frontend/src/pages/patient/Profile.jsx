import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaVenusMars, 
  FaTint, 
  FaMapMarkerAlt, 
  FaUserInjured, 
  FaExclamationTriangle,
  FaCamera,
  FaEdit,
  FaTimes,
  FaCheck,
  FaAllergies,
  FaNotesMedical,
  FaUserShield,
  FaIdCard,
  FaHome,
  FaCity,
  FaGlobeAmericas,
  FaMailBulk
} from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: ''
  });
  const [patientForm, setPatientForm] = useState({
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
  });
  
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const updatedUserData = { ...userForm };

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
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating user profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatientFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let response;
      
      if (patientProfile) {
        // Update existing patient profile
        response = await api.put(`/patients/${patientProfile._id}`, patientForm);
      } else {
        // Create new patient profile
        response = await api.post('/patients', patientForm);
      }
      
      setPatientProfile(response.data);
      setIsEditingPatient(false);
      toast.success(patientProfile ? 'Medical profile updated successfully' : 'Medical profile created successfully');
    } catch (err) {
      console.error('Error updating patient profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update medical profile');
    } finally {
      setSubmitting(false);
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaUser className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-blue-100 text-lg mt-1">
                  Manage your personal information and medical details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FaIdCard className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            </div>
            {!isEditingUser ? (
              <button
                onClick={() => setIsEditingUser(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingUser(false);
                  setUserForm({
                    name: userProfile.name,
                    email: userProfile.email,
                    phone: userProfile.phone || '',
                    profilePicture: userProfile.profilePicture || ''
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-200 hover:shadow-sm transition-all duration-200"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            {isEditingUser ? (
              <form onSubmit={handleUserFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Picture */}
                  <div className="md:col-span-1 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src={imagePreview || userForm.profilePicture || `https://ui-avatars.com/api/?name=${userForm.name}&background=0891b2&color=fff`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                        <FaCamera className="h-5 w-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">Click camera to update photo</p>
                  </div>

                  {/* Form Fields */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          id="name"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          id="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          id="phone"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaCheck className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture Display */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img
                      src={userProfile.profilePicture || `https://ui-avatars.com/api/?name=${userProfile.name}&background=0891b2&color=fff`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* User Info Display */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaUser className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-lg font-medium text-gray-900">{userProfile.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="text-lg font-medium text-gray-900">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  {userProfile.phone && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaPhone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-lg font-medium text-gray-900">{userProfile.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <FaNotesMedical className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
            </div>
            {!isEditingPatient ? (
              <button
                onClick={() => setIsEditingPatient(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                {patientProfile ? 'Edit' : 'Complete Profile'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingPatient(false);
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
                className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-200 hover:shadow-sm transition-all duration-200"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            {!patientProfile && !isEditingPatient ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <FaUserInjured className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No medical profile yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Complete your medical profile to help doctors provide better healthcare services.
                </p>
                <button
                  onClick={() => setIsEditingPatient(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <FaUserShield className="mr-2 h-5 w-5" />
                  Complete Medical Profile
                </button>
              </div>
            ) : isEditingPatient ? (
              <form onSubmit={handlePatientFormSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FaIdCard className="h-5 w-5 text-blue-600" />
                    </div>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="date"
                          value={patientForm.dateOfBirth}
                          onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <div className="relative">
                        <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          value={patientForm.gender}
                          onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <div className="relative">
                        <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          value={patientForm.bloodGroup}
                          onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Select Blood Group</option>
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
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <FaMapMarkerAlt className="h-5 w-5 text-purple-600" />
                    </div>
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <div className="relative">
                        <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={patientForm.address.street}
                          onChange={(e) => setPatientForm({ 
                            ...patientForm, 
                            address: { ...patientForm.address, street: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={patientForm.address.city}
                          onChange={(e) => setPatientForm({ 
                            ...patientForm, 
                            address: { ...patientForm.address, city: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={patientForm.address.state}
                          onChange={(e) => setPatientForm({ 
                            ...patientForm, 
                            address: { ...patientForm.address, state: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <div className="relative">
                        <FaMailBulk className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={patientForm.address.zipCode}
                          onChange={(e) => setPatientForm({ 
                            ...patientForm, 
                            address: { ...patientForm.address, zipCode: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <div className="relative">
                        <FaGlobeAmericas className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={patientForm.address.country}
                          onChange={(e) => setPatientForm({ 
                            ...patientForm, 
                            address: { ...patientForm.address, country: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                      <FaUserShield className="h-5 w-5 text-red-600" />
                    </div>
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={patientForm.emergencyContact.name}
                        onChange={(e) => setPatientForm({ 
                          ...patientForm, 
                          emergencyContact: { ...patientForm.emergencyContact, name: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={patientForm.emergencyContact.phone}
                        onChange={(e) => setPatientForm({ 
                          ...patientForm, 
                          emergencyContact: { ...patientForm.emergencyContact, phone: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={patientForm.emergencyContact.relationship}
                        onChange={(e) => setPatientForm({ 
                          ...patientForm, 
                          emergencyContact: { ...patientForm.emergencyContact, relationship: e.target.value }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Spouse"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <FaNotesMedical className="h-5 w-5 text-yellow-600" />
                    </div>
                    Medical History
                  </h3>
                  
                  {/* Allergies */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Allergies
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAllergy();
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter allergy (e.g., Peanuts, Penicillin)"
                        />
                        <button
                          type="button"
                          onClick={handleAddAllergy}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                      {patientForm.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {patientForm.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                            >
                              <FaAllergies className="mr-1.5 h-3 w-3" />
                              {allergy}
                              <button
                                type="button"
                                onClick={() => handleRemoveAllergy(index)}
                                className="ml-2 hover:text-red-600"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chronic Conditions
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCondition();
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter condition (e.g., Diabetes, Hypertension)"
                        />
                        <button
                          type="button"
                          onClick={handleAddCondition}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          Add
                        </button>
                      </div>
                      {patientForm.chronicConditions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {patientForm.chronicConditions.map((condition, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              <FaExclamationTriangle className="mr-1.5 h-3 w-3" />
                              {condition}
                              <button
                                type="button"
                                onClick={() => handleRemoveCondition(index)}
                                className="ml-2 hover:text-orange-600"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2 h-4 w-4" />
                        {patientProfile ? 'Update Medical Profile' : 'Create Medical Profile'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Display Medical Profile
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FaIdCard className="h-5 w-5 text-blue-600" />
                    </div>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Date of Birth</p>
                          <p className="text-lg font-medium text-gray-900">
                            {patientProfile.dateOfBirth 
                              ? new Date(patientProfile.dateOfBirth).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaVenusMars className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="text-lg font-medium text-gray-900 capitalize">
                            {patientProfile.gender || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaTint className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Blood Group</p>
                          <p className="text-lg font-medium text-gray-900">
                            {patientProfile.bloodGroup || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {patientProfile.address && (patientProfile.address.street || patientProfile.address.city) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg mr-3">
                        <FaMapMarkerAlt className="h-5 w-5 text-purple-600" />
                      </div>
                      Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">
                        {[
                          patientProfile.address.street,
                          patientProfile.address.city,
                          patientProfile.address.state,
                          patientProfile.address.zipCode,
                          patientProfile.address.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {patientProfile.emergencyContact && patientProfile.emergencyContact.name && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <FaUserShield className="h-5 w-5 text-red-600" />
                      </div>
                      Emergency Contact
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-lg font-medium text-gray-900">
                            {patientProfile.emergencyContact.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-lg font-medium text-gray-900">
                            {patientProfile.emergencyContact.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Relationship</p>
                          <p className="text-lg font-medium text-gray-900">
                            {patientProfile.emergencyContact.relationship}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Medical History */}
                {(patientProfile.allergies?.length > 0 || patientProfile.chronicConditions?.length > 0) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                        <FaNotesMedical className="h-5 w-5 text-yellow-600" />
                      </div>
                      Medical History
                    </h3>
                    
                    {patientProfile.allergies?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Allergies</h4>
                        <div className="flex flex-wrap gap-2">
                          {patientProfile.allergies.map((allergy, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                            >
                              <FaAllergies className="mr-1.5 h-3 w-3" />
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {patientProfile.chronicConditions?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Chronic Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          {patientProfile.chronicConditions.map((condition, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              <FaExclamationTriangle className="mr-1.5 h-3 w-3" />
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
