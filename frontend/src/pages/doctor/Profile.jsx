import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner, { LoadingButton } from '../../components/LoadingSpinner';
import useFormValidation from '../../hooks/useFormValidation';
import { FaUser, FaEnvelope, FaPhone, FaUserMd, FaBriefcaseMedical, FaUniversity, FaMoneyBillWave, FaMapMarkerAlt, FaCalendarAlt, FaFileUpload } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingDoctor, setIsEditingDoctor] = useState(false);
  
  // User form validation
  const initialUserForm = {
    name: '',
    email: '',
    phone: '',
    profilePicture: ''
  };

  const validateUserForm = (values) => {
    const errors = {};
    
    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    return errors;
  };

  const {
    values: userForm,
    errors: userErrors,
    touched: userTouched,
    handleChange: handleUserFormChange,
    handleBlur: handleUserBlur,
    handleSubmit: handleUserFormSubmit,
    setValues: setUserForm,
    resetForm: resetUserForm
  } = useFormValidation(
    initialUserForm,
    validateUserForm,
    submitUserForm
  );

  // Doctor form validation
  const initialDoctorForm = {
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
  };

  const validateDoctorForm = (values) => {
    const errors = {};
    
    if (!values.specialization.trim()) {
      errors.specialization = 'Specialization is required';
    }
    
    if (!values.licenseNumber.trim()) {
      errors.licenseNumber = 'License number is required';
    }
    
    if (!values.qualification.trim()) {
      errors.qualification = 'Qualification is required';
    }
    
    if (values.experience === '') {
      errors.experience = 'Experience is required';
    } else if (isNaN(values.experience) || Number(values.experience) < 0) {
      errors.experience = 'Experience must be a positive number';
    }
    
    if (values.consultationFee === '') {
      errors.consultationFee = 'Consultation fee is required';
    } else if (isNaN(values.consultationFee) || Number(values.consultationFee) < 0) {
      errors.consultationFee = 'Consultation fee must be a positive number';
    }
    
    return errors;
  };

  const {
    values: doctorForm,
    errors: doctorErrors,
    touched: doctorTouched,
    handleChange: handleDoctorFormChange,
    handleBlur: handleDoctorBlur,
    handleSubmit: handleDoctorFormSubmit,
    setValues: setDoctorForm,
    resetForm: resetDoctorForm
  } = useFormValidation(
    initialDoctorForm,
    validateDoctorForm,
    submitDoctorForm
  );
  
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
    handleUserFormChange(e);
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
      handleDoctorFormChange(e);
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

  async function submitUserForm() {
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
      toast.success('User profile updated successfully');
    } catch (err) {
      console.error('Error updating user profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmittingUser(false);
    }
  }

  async function submitDoctorForm() {
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
      toast.success(doctorProfile ? 'Doctor profile updated successfully' : 'Doctor profile created successfully');
      
      if (!doctorProfile) {
        toast.info('Your profile will be reviewed by an administrator before it becomes visible to patients.');
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update doctor profile');
    } finally {
      setIsSubmittingDoctor(false);
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
              Manage your personal and professional information
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
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
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
                        <p className="mt-1 text-sm text-red-500">{userErrors.name}</p>
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
                        <p className="mt-1 text-sm text-red-500">{userErrors.email}</p>
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
                        isLoading={isSubmittingUser}
                        disabled={isSubmittingUser}
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

        {/* Doctor Profile Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-lg font-medium text-gray-900">Professional Information</h2>
              {doctorProfile && !doctorProfile.isApproved && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Approval
                </span>
              )}
              {doctorProfile && doctorProfile.isApproved && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              )}
            </div>
            {!isEditingDoctor ? (
              <button
                onClick={() => setIsEditingDoctor(true)}
                className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
              >
                {doctorProfile ? 'Edit' : 'Complete Profile'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditingDoctor(false);
                  if (doctorProfile) {
                    // Reset form to current values
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
                className="px-3 py-1 border border-gray-300 text-sm rounded-md text-red-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="px-6 py-4">
            {!doctorProfile && !isEditingDoctor ? (
              <div className="text-center py-8">
                <FaUserMd className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No professional profile yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete your professional profile to start accepting appointments.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditingDoctor(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Complete Professional Profile
                  </button>
                </div>
              </div>
            ) : isEditingDoctor ? (
              <form onSubmit={handleDoctorFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      id="specialization"
                      value={doctorForm.specialization}
                      onChange={handleDoctorChange}
                      onBlur={handleDoctorBlur}
                      required
                      className={`mt-1 block w-full border ${doctorTouched.specialization && doctorErrors.specialization ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {doctorTouched.specialization && doctorErrors.specialization && (
                      <p className="mt-1 text-sm text-red-500">{doctorErrors.specialization}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                      License Number
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      id="licenseNumber"
                      value={doctorForm.licenseNumber}
                      onChange={handleDoctorChange}
                      onBlur={handleDoctorBlur}
                      required
                      className={`mt-1 block w-full border ${doctorTouched.licenseNumber && doctorErrors.licenseNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {doctorTouched.licenseNumber && doctorErrors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-500">{doctorErrors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      id="qualification"
                      value={doctorForm.qualification}
                      onChange={handleDoctorChange}
                      onBlur={handleDoctorBlur}
                      required
                      className={`mt-1 block w-full border ${doctorTouched.qualification && doctorErrors.qualification ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="MD, MBBS, etc."
                    />
                    {doctorTouched.qualification && doctorErrors.qualification && (
                      <p className="mt-1 text-sm text-red-500">{doctorErrors.qualification}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      value={doctorForm.experience}
                      onChange={handleDoctorChange}
                      onBlur={handleDoctorBlur}
                      required
                      min="0"
                      className={`mt-1 block w-full border ${doctorTouched.experience && doctorErrors.experience ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {doctorTouched.experience && doctorErrors.experience && (
                      <p className="mt-1 text-sm text-red-500">{doctorErrors.experience}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      id="consultationFee"
                      value={doctorForm.consultationFee}
                      onChange={handleDoctorChange}
                      onBlur={handleDoctorBlur}
                      required
                      min="0"
                      step="0.01"
                      className={`mt-1 block w-full border ${doctorTouched.consultationFee && doctorErrors.consultationFee ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {doctorTouched.consultationFee && doctorErrors.consultationFee && (
                      <p className="mt-1 text-sm text-red-500">{doctorErrors.consultationFee}</p>
                    )}
                  </div>
                </div>

                {/* About */}
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About / Bio
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    value={doctorForm.about}
                    onChange={handleDoctorChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Write a brief professional bio"
                  />
                </div>

                {/* Clinic Address */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Clinic Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        Street
                      </label>
                      <input
                        type="text"
                        name="clinicAddress.street"
                        id="street"
                        value={doctorForm.clinicAddress.street}
                        onChange={handleDoctorChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="clinicAddress.city"
                        id="city"
                        value={doctorForm.clinicAddress.city}
                        onChange={handleDoctorChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="clinicAddress.state"
                        id="state"
                        value={doctorForm.clinicAddress.state}
                        onChange={handleDoctorChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        name="clinicAddress.zipCode"
                        id="zipCode"
                        value={doctorForm.clinicAddress.zipCode}
                        onChange={handleDoctorChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        name="clinicAddress.country"
                        id="country"
                        value={doctorForm.clinicAddress.country}
                        onChange={handleDoctorChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Availability</h3>
                  <div className="overflow-hidden border border-gray-300 rounded-md">
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <input
                                type="time"
                                value={slot.endTime}
                                                                onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                disabled={!slot.isAvailable}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
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
                  <h3 className="text-md font-medium text-gray-900 mb-3">Documents</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Upload your degree certificates, licenses, and other professional documents.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctorForm.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center bg-blue-50 px-3 py-2 rounded-md">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          {doc.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(idx)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
                        Document Name
                      </label>
                      <input
                        type="text"
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder="e.g., Medical License, Degree Certificate"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="documentFile" className="block text-sm font-medium text-gray-700">
                        Document File
                      </label>
                      <label className="mt-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <FaFileUpload className="mr-2 h-5 w-5 text-gray-400" />
                        {documentFile ? documentFile.name.substring(0, 20) + '...' : 'Choose File'}
                        <input
                          type="file"
                          id="documentFile"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddDocument}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Upload Document
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    isLoading={isSubmittingDoctor}
                    disabled={isSubmittingDoctor}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {doctorProfile ? 'Update Professional Profile' : 'Create Professional Profile'}
                  </LoadingButton>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <FaUserMd className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaBriefcaseMedical className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile.licenseNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaUniversity className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaBriefcaseMedical className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-sm font-medium text-gray-900">{doctorProfile.experience} years</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaMoneyBillWave className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="text-sm font-medium text-gray-900">${doctorProfile.consultationFee}</p>
                    </div>
                  </div>
                </div>

                {/* About */}
                {doctorProfile.about && (
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-sm text-gray-600">{doctorProfile.about}</p>
                  </div>
                )}

                {/* Clinic Address */}
                {(doctorProfile.clinicAddress && Object.values(doctorProfile.clinicAddress).some(val => val)) && (
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-2" />
                      Clinic Address
                    </h3>
                    <p className="text-sm text-gray-600">
                      {doctorProfile.clinicAddress.street && <span>{doctorProfile.clinicAddress.street}, </span>}
                      {doctorProfile.clinicAddress.city && <span>{doctorProfile.clinicAddress.city}, </span>}
                      {doctorProfile.clinicAddress.state && <span>{doctorProfile.clinicAddress.state}, </span>}
                      {doctorProfile.clinicAddress.zipCode && <span>{doctorProfile.clinicAddress.zipCode}, </span>}
                      {doctorProfile.clinicAddress.country && <span>{doctorProfile.clinicAddress.country}</span>}
                    </p>
                  </div>
                )}

                {/* Availability */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-2" />
                    Availability
                  </h3>
                  <div className="overflow-hidden border border-gray-200 rounded-md">
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
                                  Available
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
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
                    <h3 className="text-md font-medium text-gray-900 mb-3">Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctorProfile.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center bg-blue-50 px-3 py-2 rounded-md hover:bg-blue-100"
                        >
                          <FaFileUpload className="mr-2 h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">{doc.name}</span>
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
