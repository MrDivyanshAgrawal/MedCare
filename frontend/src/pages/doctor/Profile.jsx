import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUserMd, 
  FaBriefcaseMedical, 
  FaUniversity, 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaFileUpload,
  FaCamera,
  FaEdit,
  FaTimes,
  FaCheck,
  FaStethoscope,
  FaCertificate,
  FaClock,
  FaInfoCircle,
  FaGlobeAmericas,
  FaCity,
  FaHome,
  FaMailBulk,
  FaExclamationTriangle
} from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: ''
  });
  const [doctorForm, setDoctorForm] = useState({
    specialization: '',
    licenseNumber: '',
    experience: '',
    qualification: '',
    consultationFee: '',
    clinicAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    availability: [],
    about: '',
    documents: []
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);

  // Availability days
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    fetchUserAndDoctorProfiles();
  }, []);

  const fetchUserAndDoctorProfiles = async () => {
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

      // Fetch doctor profile
      try {
        const doctorResponse = await api.get('/doctors/me');
        setDoctorProfile(doctorResponse.data);
        
        // Initialize availability array if empty
        let availability = doctorResponse.data.availability || [];
        if (availability.length === 0) {
          availability = days.map(day => ({
            day,
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: day !== 'saturday' && day !== 'sunday'
          }));
        }
        
        setDoctorForm({
          specialization: doctorResponse.data.specialization || '',
          licenseNumber: doctorResponse.data.licenseNumber || '',
          experience: doctorResponse.data.experience || '',
          qualification: doctorResponse.data.qualification || '',
          consultationFee: doctorResponse.data.consultationFee || '',
          clinicAddress: doctorResponse.data.clinicAddress || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          availability,
          about: doctorResponse.data.about || '',
          documents: doctorResponse.data.documents || []
        });
      } catch (err) {
        // It's okay if doctor profile doesn't exist yet
        console.log('Doctor profile not found or not created yet');
        
        // Initialize availability array for new profile
        const defaultAvailability = days.map(day => ({
          day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: day !== 'saturday' && day !== 'sunday'
        }));
        
        setDoctorForm(prev => ({
          ...prev,
          availability: defaultAvailability
        }));
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profile data. Please refresh and try again.');
      setIsLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setDoctorForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setDoctorForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    setDoctorForm(prev => {
      const newAvailability = [...prev.availability];
      newAvailability[index] = { 
        ...newAvailability[index], 
        [field]: field === 'isAvailable' ? value === 'true' : value 
      };
      return {
        ...prev,
        availability: newAvailability
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentName(file.name);
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

  const uploadDocument = async () => {
    if (!documentFile) return null;

    const formData = new FormData();
    formData.append('file', documentFile);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        name: documentName || documentFile.name,
        url: response.data.data.url
      };
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      return null;
    }
  };

  const handleAddDocument = async () => {
    if (!documentFile) {
      toast.error('Please select a document to upload');
      return;
    }

    const documentData = await uploadDocument();
    if (documentData) {
      setDoctorForm(prev => ({
        ...prev,
        documents: [...prev.documents, documentData]
      }));
      setDocumentFile(null);
      setDocumentName('');
      toast.success('Document uploaded successfully');
    }
  };

  const handleRemoveDocument = (index) => {
    setDoctorForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!userForm.name || !userForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmittingUser(true);
    
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
      setIsSubmittingUser(false);
    }
  };

  const handleDoctorFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!doctorForm.specialization || !doctorForm.licenseNumber || !doctorForm.qualification || !doctorForm.experience || !doctorForm.consultationFee) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmittingDoctor(true);
    
    try {
      let response;
      
      if (doctorProfile) {
        // Update existing doctor profile
        response = await api.put(`/doctors/${doctorProfile._id}`, doctorForm);
      } else {
        // Create new doctor profile
        response = await api.post('/doctors', doctorForm);
      }
      
      setDoctorProfile(response.data);
      setIsEditingDoctor(false);
      toast.success(doctorProfile ? 'Professional profile updated successfully' : 'Professional profile created successfully');
      
      if (!doctorProfile) {
        toast.info('Your profile will be reviewed by an administrator before it becomes visible to patients.');
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update professional profile');
    } finally {
      setIsSubmittingDoctor(false);
    }
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
                  Manage your personal and professional information
                </p>
              </div>
            </div>
          </div>
        </div>

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

        {/* User Profile Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FaUser className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
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
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={userForm.name}
                          onChange={handleUserChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={userForm.email}
                          onChange={handleUserChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          name="phone"
                          id="phone"
                          value={userForm.phone}
                          onChange={handleUserChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingUser}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingUser ? (
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

        {/* Doctor Profile Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FaStethoscope className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
                {doctorProfile && (
                  <span className={`text-sm ${
                    doctorProfile.isApproved 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    {doctorProfile.isApproved ? '✓ Verified' : '⏳ Pending Verification'}
                  </span>
                )}
              </div>
            </div>
            {!isEditingDoctor ? (
              <button
                onClick={() => setIsEditingDoctor(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                {doctorProfile ? 'Edit' : 'Complete Profile'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingDoctor(false);
                  // Reset form
                  if (doctorProfile) {
                    setDoctorForm({
                      specialization: doctorProfile.specialization || '',
                      licenseNumber: doctorProfile.licenseNumber || '',
                      experience: doctorProfile.experience || '',
                      qualification: doctorProfile.qualification || '',
                      consultationFee: doctorProfile.consultationFee || '',
                      clinicAddress: doctorProfile.clinicAddress || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: ''
                      },
                      availability: doctorProfile.availability || [],
                      about: doctorProfile.about || '',
                      documents: doctorProfile.documents || []
                    });
                  }
                  setDocumentFile(null);
                  setDocumentName('');
                }}
                className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-200 hover:shadow-sm transition-all duration-200"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <div className="p-6">
            {!doctorProfile && !isEditingDoctor ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6">
                  <FaUserMd className="h-12 w-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No professional profile yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Complete your professional profile to start accepting appointments from patients.
                </p>
                <button
                  onClick={() => setIsEditingDoctor(true)}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <FaUserMd className="mr-2 h-5 w-5" />
                  Complete Professional Profile
                </button>
              </div>
            ) : isEditingDoctor ? (
              <form onSubmit={handleDoctorFormSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FaBriefcaseMedical className="h-5 w-5 text-blue-600" />
                    </div>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaStethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="specialization"
                          id="specialization"
                          value={doctorForm.specialization}
                          onChange={handleDoctorChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Cardiologist"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaCertificate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="licenseNumber"
                          id="licenseNumber"
                          value={doctorForm.licenseNumber}
                          onChange={handleDoctorChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Medical license number"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="qualification"
                          id="qualification"
                          value={doctorForm.qualification}
                          onChange={handleDoctorChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., MBBS, MD"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="experience"
                          id="experience"
                          value={doctorForm.experience}
                          onChange={handleDoctorChange}
                          required
                          min="0"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Years of practice"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="number"
                          name="consultationFee"
                          id="consultationFee"
                          value={doctorForm.consultationFee}
                          onChange={handleDoctorChange}
                          required
                          min="0"
                          step="50"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Consultation fee"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                    About / Bio
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows={4}
                    value={doctorForm.about}
                    onChange={handleDoctorChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Write a brief professional bio..."
                  />
                </div>

                {/* Clinic Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
                    </div>
                    Clinic Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <div className="relative">
                        <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="clinicAddress.street"
                          id="street"
                          value={doctorForm.clinicAddress.street}
                          onChange={handleDoctorChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="clinicAddress.city"
                          id="city"
                          value={doctorForm.clinicAddress.city}
                          onChange={handleDoctorChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="clinicAddress.state"
                          id="state"
                          value={doctorForm.clinicAddress.state}
                          onChange={handleDoctorChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <div className="relative">
                        <FaMailBulk className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="clinicAddress.zipCode"
                          id="zipCode"
                          value={doctorForm.clinicAddress.zipCode}
                          onChange={handleDoctorChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <div className="relative">
                        <FaGlobeAmericas className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="clinicAddress.country"
                          id="country"
                          value={doctorForm.clinicAddress.country}
                          onChange={handleDoctorChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <FaCalendarAlt className="h-5 w-5 text-yellow-600" />
                    </div>
                    Availability Schedule
                  </h3>
                  <div className="overflow-hidden border border-gray-300 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Day</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Available</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Start Time</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">End Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {doctorForm.availability.map((slot, index) => (
                          <tr key={slot.day}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 capitalize">
                              {slot.day}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <select
                                value={slot.isAvailable.toString()}
                                onChange={(e) => handleAvailabilityChange(index, 'isAvailable', e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                              >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                disabled={!slot.isAvailable}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                disabled={!slot.isAvailable}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <FaCertificate className="h-5 w-5 text-orange-600" />
                    </div>
                    Professional Documents
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload your degree certificates, licenses, and other professional documents.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctorForm.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center bg-purple-50 px-3 py-2 rounded-lg">
                        <FaFileUpload className="h-4 w-4 text-purple-600 mr-2" />
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          {doc.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(idx)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="Document name (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                        <FaFileUpload className="mr-2 h-5 w-5 text-gray-400" />
                        {documentFile ? documentFile.name.substring(0, 20) + '...' : 'Choose File'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingDoctor}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingDoctor ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2 h-4 w-4" />
                        {doctorProfile ? 'Update Professional Profile' : 'Create Professional Profile'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Basic Information Display */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FaBriefcaseMedical className="h-5 w-5 text-blue-600" />
                    </div>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaStethoscope className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="text-lg font-medium text-gray-900">{doctorProfile.specialization}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaCertificate className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">License Number</p>
                          <p className="text-lg font-medium text-gray-900">{doctorProfile.licenseNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaUniversity className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Qualification</p>
                          <p className="text-lg font-medium text-gray-900">{doctorProfile.qualification}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaClock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="text-lg font-medium text-gray-900">{doctorProfile.experience} years</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                          <p className="text-lg font-medium text-gray-900">₹{doctorProfile.consultationFee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About */}
                {doctorProfile.about && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{doctorProfile.about}</p>
                  </div>
                )}

                {/* Clinic Address */}
                {(doctorProfile.clinicAddress && Object.values(doctorProfile.clinicAddress).some(val => val)) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
                      </div>
                      Clinic Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {[
                          doctorProfile.clinicAddress.street,
                          doctorProfile.clinicAddress.city,
                          doctorProfile.clinicAddress.state,
                          doctorProfile.clinicAddress.zipCode,
                          doctorProfile.clinicAddress.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <FaCalendarAlt className="h-5 w-5 text-yellow-600" />
                    </div>
                    Availability
                  </h3>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {doctorProfile.availability && doctorProfile.availability.map((slot) => (
                          <tr key={slot.day}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{slot.day}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {slot.isAvailable ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  <FaCheck className="mr-1 h-3 w-3" />
                                  Available
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  <FaTimes className="mr-1 h-3 w-3" />
                                  Not Available
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {slot.isAvailable ? `${slot.startTime} - ${slot.endTime}` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Documents */}
                {doctorProfile.documents && doctorProfile.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg mr-3">
                        <FaCertificate className="h-5 w-5 text-orange-600" />
                      </div>
                      Professional Documents
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {doctorProfile.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                        >
                          <FaFileUpload className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </a>
                      ))}
                    </div>
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
