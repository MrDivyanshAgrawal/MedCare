// src/pages/patient/MedicalRecords.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { FaFileMedical, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';

const MedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await api.get('/medical-records');
      setMedicalRecords(response.data);
      
      // Extract unique doctors from medical records
      const uniqueDoctors = [...new Set(response.data.map(record => record.doctor.user.name))];
      setDoctors(uniqueDoctors);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again.');
      setLoading(false);
    }
  };

  // Filter medical records based on search term and selected doctor
  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        record.treatment.toLowerCase().includes(searchTerm.toLowerCase());
                        
    const matchesDoctor = selectedDoctor === '' || record.doctor.user.name === selectedDoctor;
    
    return matchesSearch && matchesDoctor;
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
              View your complete medical history
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
            <div className="col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by diagnosis or treatment"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">All Doctors</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor}>Dr. {doctor}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {medicalRecords.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <li key={record._id}>
                  <div className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-green-100 rounded-full">
                            <FaFileMedical className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {record.diagnosis}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>Dr. {record.doctor.user.name}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/patient/medical-records/${record._id}`}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      <div className="sm:col-span-1">
                        <div className="text-sm font-medium text-gray-700">Treatment</div>
                        <div className="mt-1 text-sm text-gray-900 line-clamp-2">{record.treatment}</div>
                      </div>
                      <div className="sm:col-span-1">
                        <div className="text-sm font-medium text-gray-700">Symptoms</div>
                        <div className="mt-1 text-sm text-gray-900">
                          {record.symptoms && record.symptoms.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {record.symptoms.slice(0, 3).map((symptom, idx) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {symptom}
                                </span>
                              ))}
                              {record.symptoms.length > 3 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{record.symptoms.length - 3} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">No symptoms recorded</span>
                          )}
                        </div>
                      </div>
                      {record.medications && record.medications.length > 0 && (
                        <div className="sm:col-span-2">
                          <div className="text-sm font-medium text-gray-700">Medications</div>
                          <div className="mt-1 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-2">
                              {record.medications.slice(0, 2).map((medication, idx) => (
                                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {medication.name} ({medication.dosage})
                                </span>
                              ))}
                              {record.medications.length > 2 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  +{record.medications.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700">Attachments</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {record.attachments.map((attachment, idx) => (
                            <a
                              key={idx}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500"
                            >
                              {attachment.name}
                              <FaDownload className="ml-2 h-4 w-4" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No medical records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your medical records will appear here after your appointments.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;
