import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { 
  FaFileMedical, 
  FaDownload, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaUserMd,
  FaPills,
  FaNotesMedical,
  FaChevronRight,
  FaStethoscope,
  FaClock,
  FaPaperclip,
  FaExclamationCircle
} from 'react-icons/fa';

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
              <FaFileMedical className="h-10 w-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Medical Records</h1>
                <p className="text-green-100 text-lg mt-1">
                  Your complete medical history and health documentation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by diagnosis or treatment..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none transition-all duration-200"
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

        {/* Medical Records List */}
        {filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div 
                key={record._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                          <FaFileMedical className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {record.diagnosis}
                        </h3>
                        
                        {/* Meta Information */}
                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <FaUserMd className="mr-1.5 h-4 w-4" />
                            Dr. {record.doctor.user.name}
                          </span>
                          <span className="flex items-center">
                            <FaStethoscope className="mr-1.5 h-4 w-4" />
                            {record.doctor.specialization}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1.5 h-4 w-4" />
                            {new Date(record.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {/* Treatment Summary */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Treatment Plan</h4>
                          <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                            {record.treatment}
                          </p>
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Symptoms */}
                          {record.symptoms && record.symptoms.length > 0 && (
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <h5 className="text-xs font-medium text-yellow-800 mb-2 flex items-center">
                                <FaNotesMedical className="mr-1 h-3 w-3" />
                                Symptoms
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {record.symptoms.slice(0, 3).map((symptom, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800"
                                  >
                                    {symptom}
                                  </span>
                                ))}
                                {record.symptoms.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800">
                                    +{record.symptoms.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {record.medications && record.medications.length > 0 && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <h5 className="text-xs font-medium text-purple-800 mb-2 flex items-center">
                                <FaPills className="mr-1 h-3 w-3" />
                                Medications
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {record.medications.slice(0, 2).map((medication, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800"
                                  >
                                    {medication.name}
                                  </span>
                                ))}
                                {record.medications.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                                    +{record.medications.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Attachments */}
                          {record.attachments && record.attachments.length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h5 className="text-xs font-medium text-blue-800 mb-2 flex items-center">
                                <FaPaperclip className="mr-1 h-3 w-3" />
                                Documents
                              </h5>
                              <p className="text-xs text-blue-700">
                                {record.attachments.length} file{record.attachments.length > 1 ? 's' : ''} available
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Attachment Links */}
                        {record.attachments && record.attachments.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {record.attachments.slice(0, 2).map((attachment, idx) => (
                              <a
                                key={idx}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                              >
                                <FaDownload className="mr-2 h-3 w-3" />
                                {attachment.name}
                              </a>
                            ))}
                            {record.attachments.length > 2 && (
                              <span className="inline-flex items-center px-3 py-1.5 text-sm text-gray-500">
                                +{record.attachments.length - 2} more files
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        to={`/patient/medical-records/${record._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        View Details
                        <FaChevronRight className="ml-2 h-4 w-4" />
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
                <FaFileMedical className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No medical records found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || selectedDoctor 
                  ? "No records match your search criteria. Try adjusting your filters."
                  : "Your medical records will appear here after your appointments."}
              </p>
              {(searchTerm || selectedDoctor) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDoctor('');
                  }}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;
