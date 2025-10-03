// src/pages/admin/Patients.jsx
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
  FaTrashAlt
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
      
      // Remove from local state
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
            <h1 className="text-2xl font-bold">Patients Management</h1>
            <p className="mt-1 text-indigo-100">
              View and manage patient information
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

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredPatients.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <li key={patient._id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-12 w-12 rounded-full" 
                          src={patient.user.profilePicture || "https://via.placeholder.com/48"} 
                          alt={patient.user.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{patient.user.name}</h3>
                        <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                          {patient.dateOfBirth && (
                            <>
                              <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{calculateAge(patient.dateOfBirth)} years</span>
                              <span className="mx-2">•</span>
                            </>
                          )}
                          <span className="capitalize">{patient.gender || 'Unknown gender'}</span>
                          {patient.bloodGroup && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-red-600 font-medium">{patient.bloodGroup}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-wrap md:flex-nowrap gap-2">
                      <Link
                        to={`/admin/patients/${patient._id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <FaEye className="mr-1 h-4 w-4" />
                        View
                      </Link>
                      <Link
                        to={`/admin/patients/${patient._id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        <FaEdit className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <Link
                        to={`/admin/patients/${patient._id}/records`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        <FaFileMedical className="mr-1 h-4 w-4" />
                        Medical Records
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(patient._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <FaTrashAlt className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Email: </span>
                      <span className="font-medium text-gray-900">{patient.user.email || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Phone: </span>
                      <span className="font-medium text-gray-900">{patient.user.phone || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Address: </span>
                      <span className="font-medium text-gray-900">{patient.address || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {patient.emergencyContact && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Emergency Contact: </span>
                      <span className="font-medium text-gray-900">
                        {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <FaUserInjured className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No patients found</h3>
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
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this patient? This action cannot be undone and will remove all associated records.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePatient(confirmDelete)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
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
