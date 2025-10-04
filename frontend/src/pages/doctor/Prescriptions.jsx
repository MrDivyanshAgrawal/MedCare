import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaPrescription, 
  FaSearch, 
  FaUser, 
  FaCalendarAlt, 
  FaPills, 
  FaEye,
  FaPlus,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaClock,
  FaNotesMedical,
  FaChevronRight
} from 'react-icons/fa';

const Prescriptions = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patientIdParam || '');
  const [patients, setPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, [patientIdParam]);

  const fetchPrescriptions = async () => {
    try {
      let url = '/prescriptions';
      if (patientIdParam) {
        url += `?patientId=${patientIdParam}`;
      }
      
      const response = await api.get(url);
      setPrescriptions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions. Please try again.');
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

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/prescriptions/${id}`, { status });
      toast.success(`Prescription marked as ${status}`);
      
      // Update local state
      setPrescriptions(prescriptions.map(prescription => 
        prescription._id === id ? { ...prescription, status } : prescription
      ));
    } catch (err) {
      console.error('Error updating prescription:', err);
      toast.error('Failed to update prescription status');
    }
  };

  // Check if a prescription is expired
  const isPrescriptionExpired = (prescription) => {
    return prescription.status === 'active' && new Date(prescription.expiryDate) < new Date();
  };

  // Get status info for badges
  const getStatusInfo = (prescription) => {
    if (prescription.status === 'completed') {
      return {
        icon: FaCheckCircle,
        text: 'Completed',
        color: 'text-green-800',
        bg: 'bg-green-100',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      };
    } else if (prescription.status === 'cancelled') {
      return {
        icon: FaTimesCircle,
        text: 'Cancelled',
        color: 'text-red-800',
        bg: 'bg-red-100',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      };
    } else if (isPrescriptionExpired(prescription)) {
      return {
        icon: FaExclamationTriangle,
        text: 'Expired',
        color: 'text-yellow-800',
        bg: 'bg-yellow-100',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      };
    } else {
      return {
        icon: FaCheckCircle,
        text: 'Active',
        color: 'text-blue-800',
        bg: 'bg-blue-100',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      };
    }
  };

  // Filter prescriptions based on search term, selected patient, and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Check if any medication name matches the search term
    const medicationMatch = prescription.medications.some(
      med => med.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by patient
    const patientMatch = selectedPatient === '' || prescription.patient._id === selectedPatient;
    
    // Filter by status
    const statusMatch = 
      statusFilter === 'all' || 
      prescription.status === statusFilter ||
      (statusFilter === 'expired' && isPrescriptionExpired(prescription));
    
    return medicationMatch && patientMatch && statusMatch;
  });

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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaPrescription className="h-10 w-10 text-white mr-4" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Prescriptions</h1>
                  <p className="text-purple-100 text-lg mt-1">
                    Manage and track patient prescriptions
                  </p>
                </div>
              </div>
              <Link
                to="/doctor/prescriptions/create"
                className="inline-flex items-center px-6 py-3 bg-white text-purple-700 font-medium rounded-lg hover:bg-purple-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <FaPlus className="mr-2 h-5 w-5" />
                Create Prescription
              </Link>
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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by medication..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
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
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        {filteredPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => {
              const isExpired = isPrescriptionExpired(prescription);
              const statusInfo = getStatusInfo(prescription);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={prescription._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Icon */}
                        <div className={`p-3 rounded-xl ${statusInfo.iconBg}`}>
                          <FaPrescription className={`h-8 w-8 ${statusInfo.iconColor}`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Prescription for {prescription.patient.user.name}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                              <StatusIcon className="mr-1.5 h-3 w-3" />
                              {statusInfo.text}
                            </span>
                          </div>
                          
                          {/* Meta Information */}
                          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <FaCalendarAlt className="mr-1.5 h-4 w-4" />
                              Created: {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center">
                              <FaClock className="mr-1.5 h-4 w-4" />
                              {isExpired ? 'Expired on: ' : 'Valid until: '}
                              {new Date(prescription.expiryDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          {/* Medications Grid */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                              <FaPills className="mr-2 h-4 w-4" />
                              Prescribed Medications
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {prescription.medications.map((medication, idx) => (
                                                                <div key={idx} className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                                  <div className="flex items-start">
                                    <FaPills className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">{medication.name}</p>
                                      <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-medium">Dosage:</span> {medication.dosage}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Frequency:</span> {medication.frequency}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        <span className="font-medium">Duration:</span> {medication.duration}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Instructions */}
                          {prescription.instructions && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                              <h5 className="text-sm font-medium text-amber-800 mb-1 flex items-center">
                                <FaNotesMedical className="mr-2 h-4 w-4" />
                                Special Instructions
                              </h5>
                              <p className="text-sm text-amber-700">{prescription.instructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-2 justify-end">
                      <Link
                        to={`/doctor/prescriptions/${prescription._id}`}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <FaEye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                      {prescription.status === 'active' && !isExpired && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(prescription._id, 'completed')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <FaCheckCircle className="mr-2 h-4 w-4" />
                            Mark Completed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(prescription._id, 'cancelled')}
                            className="inline-flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-400 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <FaTimesCircle className="mr-2 h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <FaPrescription className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm || selectedPatient || statusFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Create a new prescription for your patients'}
              </p>
              {(!searchTerm && !selectedPatient && statusFilter === 'all') && (
                <Link
                  to="/doctor/prescriptions/create"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <FaPlus className="mr-2 h-5 w-5" />
                  Create New Prescription
                </Link>
              )}
              {(searchTerm || selectedPatient || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPatient('');
                    setStatusFilter('all');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors duration-200"
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

export default Prescriptions;
