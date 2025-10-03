// src/pages/doctor/Patients.jsx
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
  FaArrowRight 
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <h1 className="text-2xl font-bold">My Patients</h1>
            <p className="mt-1 text-blue-100">
              View and manage all patients under your care
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

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name, email, or phone"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Patients list */}
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <li key={patient._id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-12 w-12 rounded-full" 
                        src={patient.user.profilePicture || "https://via.placeholder.com/48"} 
                        alt={patient.user.name} 
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{patient.user.name}</h3>
                        <div className="flex space-x-2">
                          <Link
                            to={`/doctor/appointments/new?patientId=${patient._id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <FaCalendarAlt className="mr-1 h-4 w-4 text-gray-500" />
                            Schedule
                          </Link>
                          <Link
                            to={`/doctor/patients/${patient._id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Details <FaArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                      <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUserInjured className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span>
                            {patient.gender ? `${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}, ` : ''}
                            {patient.dateOfBirth ? 
                              `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years` : 
                              'No age info'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaFileMedical className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span>Blood Group: {patient.bloodGroup || 'Unknown'}</span>
                        </div>
                        {patient.user.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{patient.user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-6">
                    <Link to={`/doctor/medical-records?patientId=${patient._id}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                      <FaFileMedical className="mr-1 h-4 w-4" />
                      Medical Records
                    </Link>
                    <Link to={`/doctor/prescriptions?patientId=${patient._id}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                      <FaPrescription className="mr-1 h-4 w-4" />
                      Prescriptions
                    </Link>
                    <Link to={`/doctor/appointments?patientId=${patient._id}`} className="flex items-center text-sm text-gray-600 hover:text-blue-600">
                      <FaCalendarAlt className="mr-1 h-4 w-4" />
                      Appointments
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-12 text-center">
                <FaUserInjured className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No patients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? `No patients matching "${searchTerm}"` : 'You don\'t have any patients yet.'}
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
