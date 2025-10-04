import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaUserInjured, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaFileMedical, 
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaTint,
  FaVenusMars,
  FaBirthdayCake,
  FaExclamationCircle,
  FaUserFriends
} from 'react-icons/fa';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again.');
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Patient deleted successfully');
      
      setPatients(patients.filter(patient => patient._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting patient:', err);
      toast.error('Failed to delete patient');
    }
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatAddress = (address) => {
    if (typeof address === 'string') return address;
    
    return [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean).join(', ');
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (patient.user.email && patient.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.user.phone && patient.user.phone.includes(searchTerm));
      
    const matchesGender = genderFilter === '' || patient.gender === genderFilter;
    const matchesBloodGroup = bloodGroupFilter === '' || patient.bloodGroup === bloodGroupFilter;
    
    return matchesSearch && matchesGender && matchesBloodGroup;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaUserInjured className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Patients Management</h1>
                <p className="text-green-100 text-lg mt-1">
                  View and manage patient information
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-green-100 text-sm">Total Patients</p>
                <p className="text-2xl font-bold text-white">{patients.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-green-100 text-sm">New This Month</p>
                <p className="text-2xl font-bold text-white">
                  {patients.filter(p => {
                    const date = new Date(p.createdAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-green-100 text-sm">Active Patients</p>
                <p className="text-2xl font-bold text-white">{patients.length}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fadeIn">
            <div className="flex">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none transition-all duration-200"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="relative">
              <FaTint className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none transition-all duration-200"
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
              >
                <option value="">All Blood Groups</option>
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

        {/* Patients List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredPatients.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div key={patient._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <img 
                        className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md" 
                        src={patient.user.profilePicture || `https://ui-avatars.com/api/?name=${patient.user.name}&background=10b981&color=fff`} 
                        alt={patient.user.name} 
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {patient.user.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                          {patient.dateOfBirth && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                              <FaBirthdayCake className="mr-1 h-3 w-3" />
                              {calculateAge(patient.dateOfBirth)} years
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 capitalize">
                            <FaVenusMars className="mr-1 h-3 w-3" />
                            {patient.gender || 'Not specified'}
                          </span>
                          {patient.bloodGroup && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                              <FaTint className="mr-1 h-3 w-3" />
                              {patient.bloodGroup}
                            </span>
                          )}
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                            <FaHeartbeat className="mr-1 h-3 w-3" />
                            Active
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                            {patient.user.email || 'No email'}
                          </div>
                          <div className="flex items-center">
                            <FaPhone className="mr-2 h-4 w-4 text-gray-400" />
                            {patient.user.phone || 'No phone'}
                          </div>
                          {patient.address && (
                            <div className="flex items-center col-span-2">
                              <FaMapMarkerAlt className="mr-2 h-4 w-4 text-gray-400" />
                              {formatAddress(patient.address)}
                            </div>
                          )}
                        </div>
                        
                        {patient.emergencyContact && patient.emergencyContact.name && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm font-medium text-yellow-800 flex items-center">
                              <FaUserFriends className="mr-2 h-4 w-4" />
                              Emergency Contact
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                              {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
                      <Link
                        to={`/admin/patients/${patient._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-medium rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-200"
                      >
                        <FaEye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                      <Link
                        to={`/admin/patients/${patient._id}/edit`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 text-sm font-medium rounded-lg hover:from-indigo-200 hover:to-indigo-300 transition-all duration-200"
                      >
                        <FaEdit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                      <Link
                        to={`/admin/patients/${patient._id}/records`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-sm font-medium rounded-lg hover:from-green-200 hover:to-green-300 transition-all duration-200"
                      >
                        <FaFileMedical className="mr-2 h-4 w-4" />
                        Records
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(patient._id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-sm font-medium rounded-lg hover:from-red-200 hover:to-red-300 transition-all duration-200"
                      >
                        <FaTrashAlt className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-24 text-center">
              <FaUserInjured className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-3 text-lg font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || genderFilter || bloodGroupFilter 
                  ? 'Try adjusting your search filters' 
                  : 'No patients have registered yet'}
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this patient? This action cannot be undone and will remove all associated records.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePatient(confirmDelete)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Patients;
