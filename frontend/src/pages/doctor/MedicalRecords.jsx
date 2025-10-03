import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { 
  FaFileMedical, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaUser, 
  FaDownload, 
  FaEye 
} from 'react-icons/fa';

const MedicalRecords = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patientIdParam || '');
  const [patients, setPatients] = useState([]);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchMedicalRecords();
    fetchPatients();
  }, [patientIdParam]);

  const fetchMedicalRecords = async () => {
    try {
      let url = '/medical-records';
      if (patientIdParam) {
        url += `?patientId=${patientIdParam}`;
      }
      
      const response = await api.get(url);
      setMedicalRecords(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again.');
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  // Filter medical records based on search term, selected patient, and date
  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = 
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.treatment.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesPatient = selectedPatient === '' || record.patient._id === selectedPatient;
    
    const matchesDate = 
      dateFilter === '' || 
      new Date(record.createdAt).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesPatient && matchesDate;
  });

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
          <div className="px-6 py-8 bg-gradient-to-r from-green-500 to-green-700 text-white">
            <h1 className="text-2xl font-bold">Medical Records</h1>
            <p className="mt-1 text-green-100">
              View and manage patient medical records
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by diagnosis or treatment"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">All Patients</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>{patient.user.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Records List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRecords.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <li key={record._id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="p-2 bg-green-100 rounded-full">
                          <FaFileMedical className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{record.diagnosis}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <FaUser className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{record.patient.user.name}</span>
                          <span className="mx-2">•</span>
                          <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/doctor/medical-records/${record._id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        <FaEye className="mr-1 h-4 w-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="sm:col-span-1">
                      <div className="text-sm font-medium text-gray-700">Treatment</div>
                      <div className="mt-1 text-sm text-gray-900 line-clamp-2">{record.treatment}</div>
                    </div>
                    <div className="sm:col-span-1">
                      <div className="text-sm font-medium text-gray-700">Medications</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {record.medications && record.medications.length > 0 ? (
                          <>
                            {record.medications.slice(0, 3).map((med, idx) => (
                              <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {med.name}
                              </span>
                            ))}
                            {record.medications.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{record.medications.length - 3} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500">No medications prescribed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Attachments</div>
                      <div className="flex flex-wrap gap-2">
                        {record.attachments.map((attachment, idx) => (
                          <a
                            key={idx}
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                          >
                            {attachment.name}
                            <FaDownload className="ml-1 h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <FaFileMedical className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No medical records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedPatient || dateFilter 
                  ? 'Try adjusting your search filters' 
                  : 'Start by creating a medical record after completing an appointment'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;

