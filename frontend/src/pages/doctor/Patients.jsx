import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { 
  FaUserInjured, 
  FaSearch, 
  FaCalendarAlt, 
  FaFileMedical, 
  FaPrescription, 
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaTint,
  FaVenusMars,
  FaBirthdayCake,
  FaNotesMedical,
  FaHistory
} from 'react-icons/fa';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = patients.filter(
      patient => 
        patient.user.name.toLowerCase().includes(lowercasedSearch) || 
        patient.user.email.toLowerCase().includes(lowercasedSearch) ||
        (patient.user.phone && patient.user.phone.includes(searchTerm))
    );
    
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
      setFilteredPatients(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again.');
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex items-center">
              <FaUserInjured className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">My Patients</h1>
                <p className="text-purple-100 text-lg mt-1">
                  View and manage all patients under your care
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

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Patients list */}
        {filteredPatients.length > 0 ? (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        <img 
                          className="h-16 w-16 rounded-full object-cover border-3 border-white shadow-lg" 
                          src={patient.user.profilePicture || `https://ui-avatars.com/api/?name=${patient.user.name}&background=9333ea&color=fff`} 
                          alt={patient.user.name} 
                        />
                      </div>
                      
                      {/* Patient Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{patient.user.name}</h3>
                        
                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaEnvelope className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="truncate">{patient.user.email}</span>
                          </div>
                          {patient.user.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FaPhone className="mr-2 h-4 w-4 text-gray-400" />
                              <span>{patient.user.phone}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Medical Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {patient.gender && (
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <div className="flex items-center text-xs text-purple-800">
                                <FaVenusMars className="mr-1.5 h-3 w-3" />
                                <span className="font-medium capitalize">{patient.gender}</span>
                              </div>
                            </div>
                          )}
                          
                          {patient.dateOfBirth && (
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <div className="flex items-center text-xs text-blue-800">
                                <FaBirthdayCake className="mr-1.5 h-3 w-3" />
                                <span className="font-medium">{calculateAge(patient.dateOfBirth)} years</span>
                              </div>
                            </div>
                          )}
                          
                          {patient.bloodGroup && patient.bloodGroup !== 'Unknown' && (
                            <div className="bg-red-50 p-2 rounded-lg">
                              <div className="flex items-center text-xs text-red-800">
                                <FaTint className="mr-1.5 h-3 w-3" />
                                <span className="font-medium">{patient.bloodGroup}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Quick Links */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Link 
                            to={`/doctor/medical-records?patientId=${patient._id}`} 
                            className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                          >
                            <FaFileMedical className="mr-1.5 h-4 w-4" />
                            Medical Records
                          </Link>
                          <Link 
                            to={`/doctor/prescriptions?patientId=${patient._id}`} 
                            className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
                          >
                            <FaPrescription className="mr-1.5 h-4 w-4" />
                            Prescriptions
                          </Link>
                          <Link 
                            to={`/doctor/appointments?patientId=${patient._id}`} 
                            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          >
                            <FaHistory className="mr-1.5 h-4 w-4" />
                            Appointment History
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Link
                        to={`/doctor/appointments/new?patientId=${patient._id}`}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                      >
                        <FaCalendarAlt className="mr-2 h-4 w-4" />
                        Schedule
                      </Link>
                      <Link
                        to={`/doctor/patients/${patient._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        View Profile
                        <FaArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaUserInjured className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm ? `No patients matching "${searchTerm}"` : 'You don\'t have any patients yet.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Patients;
